"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config/config.json"));
const eftQuestSettings_json_1 = __importDefault(require("../config/eftQuestSettings.json"));
const zoneAndItemQuestPositions_json_1 = __importDefault(require("../config/zoneAndItemQuestPositions.json"));
const CommonUtils_1 = require("./CommonUtils");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const modName = "SPTQuestingBots";
class QuestingBots {
    commonUtils;
    logger;
    configServer;
    databaseServer;
    databaseTables;
    localeService;
    questHelper;
    profileHelper;
    vfs;
    httpResponseUtil;
    randomUtil;
    botController;
    iBotConfig;
    iPmcConfig;
    iLocationConfig;
    iAirdropConfig;
    convertIntoPmcChanceOrig = {};
    basePScavConversionChance;
    preSptLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const staticRouterModService = container.resolve("StaticRouterModService");
        const dynamicRouterModService = container.resolve("DynamicRouterModService");
        // Get config.json settings for the bepinex plugin
        staticRouterModService.registerStaticRouter(`StaticGetConfig${modName}`, [{
                url: "/QuestingBots/GetConfig",
                action: async () => {
                    return JSON.stringify(config_json_1.default);
                }
            }], "GetConfig");
        if (!config_json_1.default.enabled) {
            return;
        }
        // Game start
        // Needed to update Scav timer
        staticRouterModService.registerStaticRouter(`StaticAkiGameStart${modName}`, [{
                url: "/client/game/start",
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                action: async (url, info, sessionId, output) => {
                    if (config_json_1.default.debug.enabled) {
                        this.updateScavTimer(sessionId);
                    }
                    return output;
                }
            }], "aki");
        // Apply a scalar factor to the SPT-AKI PMC conversion chances
        dynamicRouterModService.registerDynamicRouter(`DynamicAdjustPMCConversionChances${modName}`, [{
                url: "/QuestingBots/AdjustPMCConversionChances/",
                action: async (url) => {
                    const urlParts = url.split("/");
                    const factor = Number(urlParts[urlParts.length - 2]);
                    const verify = JSON.parse(urlParts[urlParts.length - 1].toLowerCase());
                    this.adjustPmcConversionChance(factor, verify);
                    return JSON.stringify({ resp: "OK" });
                }
            }], "AdjustPMCConversionChances");
        // Apply a scalar factor to the SPT-AKI PScav conversion chance
        dynamicRouterModService.registerDynamicRouter(`DynamicAdjustPScavChance${modName}`, [{
                url: "/QuestingBots/AdjustPScavChance/",
                action: async (url) => {
                    const urlParts = url.split("/");
                    const factor = Number(urlParts[urlParts.length - 1]);
                    this.iBotConfig.chanceAssaultScavHasPlayerScavName = Math.round(this.basePScavConversionChance * factor);
                    this.commonUtils.logInfo(`Adjusted PScav spawn chance to ${this.iBotConfig.chanceAssaultScavHasPlayerScavName}%`);
                    return JSON.stringify({ resp: "OK" });
                }
            }], "AdjustPScavChance");
        // Get all EFT quest templates
        // NOTE: This includes custom quests added by mods
        staticRouterModService.registerStaticRouter(`GetAllQuestTemplates${modName}`, [{
                url: "/QuestingBots/GetAllQuestTemplates",
                action: async () => {
                    return JSON.stringify({ templates: this.questHelper.getQuestsFromDb() });
                }
            }], "GetAllQuestTemplates");
        // Get override settings for EFT quests
        staticRouterModService.registerStaticRouter(`GetEFTQuestSettings${modName}`, [{
                url: "/QuestingBots/GetEFTQuestSettings",
                action: async () => {
                    return JSON.stringify({ settings: eftQuestSettings_json_1.default });
                }
            }], "GetEFTQuestSettings");
        // Get override settings for quest zones and items
        staticRouterModService.registerStaticRouter(`GetZoneAndItemQuestPositions${modName}`, [{
                url: "/QuestingBots/GetZoneAndItemQuestPositions",
                action: async () => {
                    return JSON.stringify({ zoneAndItemPositions: zoneAndItemQuestPositions_json_1.default });
                }
            }], "GetZoneAndItemQuestPositions");
        // Override bot generation to include PScav conversion chance
        dynamicRouterModService.registerDynamicRouter(`DynamicGenerateBot${modName}`, [{
                url: "/QuestingBots/GenerateBot",
                action: async (url, info, sessionID) => {
                    const urlParts = url.split("/");
                    const pScavChance = Number(urlParts[urlParts.length - 1]);
                    const bots = await this.generateBots(info, sessionID, this.randomUtil.getChance100(pScavChance));
                    return this.httpResponseUtil.getBody(bots);
                }
            }], "GenerateBot");
        // Get Scav-raid settings to determine PScav conversion chances
        staticRouterModService.registerStaticRouter(`GetScavRaidSettings${modName}`, [{
                url: "/QuestingBots/GetScavRaidSettings",
                action: async () => {
                    return JSON.stringify({ maps: this.iLocationConfig.scavRaidTimeSettings.maps });
                }
            }], "GetScavRaidSettings");
    }
    postDBLoad(container) {
        this.configServer = container.resolve("ConfigServer");
        this.databaseServer = container.resolve("DatabaseServer");
        this.localeService = container.resolve("LocaleService");
        this.questHelper = container.resolve("QuestHelper");
        this.profileHelper = container.resolve("ProfileHelper");
        this.vfs = container.resolve("VFS");
        this.httpResponseUtil = container.resolve("HttpResponseUtil");
        this.randomUtil = container.resolve("RandomUtil");
        this.botController = container.resolve("BotController");
        this.iBotConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        this.iPmcConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        this.iLocationConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        this.iAirdropConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.AIRDROP);
        this.databaseTables = this.databaseServer.getTables();
        this.basePScavConversionChance = this.iBotConfig.chanceAssaultScavHasPlayerScavName;
        this.commonUtils = new CommonUtils_1.CommonUtils(this.logger, this.databaseTables, this.localeService);
        if (!config_json_1.default.enabled) {
            return;
        }
        if (!this.doesFileIntegrityCheckPass()) {
            config_json_1.default.enabled = false;
            return;
        }
        if (config_json_1.default.debug.always_have_airdrops) {
            this.commonUtils.logInfo("Forcing airdrops to occur at the beginning of every raid...");
            this.iAirdropConfig.airdropChancePercent.bigmap = 100;
            this.iAirdropConfig.airdropChancePercent.woods = 100;
            this.iAirdropConfig.airdropChancePercent.lighthouse = 100;
            this.iAirdropConfig.airdropChancePercent.shoreline = 100;
            this.iAirdropConfig.airdropChancePercent.interchange = 100;
            this.iAirdropConfig.airdropChancePercent.reserve = 100;
            this.iAirdropConfig.airdropChancePercent.tarkovStreets = 100;
            this.iAirdropConfig.airdropChancePercent.sandbox = 100;
            this.iAirdropConfig.airdropMinStartTimeSeconds = 5;
            this.iAirdropConfig.airdropMaxStartTimeSeconds = 10;
        }
        // Adjust parameters to make debugging easier
        if (config_json_1.default.debug.enabled) {
            this.commonUtils.logInfo("Applying debug options...");
            if (config_json_1.default.debug.scav_cooldown_time < this.databaseTables.globals.config.SavagePlayCooldown) {
                this.databaseTables.globals.config.SavagePlayCooldown = config_json_1.default.debug.scav_cooldown_time;
            }
            if (config_json_1.default.debug.free_labs_access) {
                this.databaseTables.locations.laboratory.base.AccessKeys = [];
                this.databaseTables.locations.laboratory.base.DisabledForScav = false;
            }
            if (config_json_1.default.debug.full_length_scav_raids) {
                this.forceFullLengthScavRaids();
            }
        }
    }
    postSptLoad(container) {
        if (!config_json_1.default.enabled) {
            this.commonUtils.logInfo("Mod disabled in config.json", true);
            return;
        }
        this.removeBlacklistedBrainTypes();
        // If we find SWAG, MOAR or BetterSpawnsPlus, disable initial spawns
        const presptModLoader = container.resolve("PreSptModLoader");
        if (config_json_1.default.bot_spawns.enabled && presptModLoader.getImportedModsNames().includes("SWAG")) {
            this.commonUtils.logWarning("SWAG Detected. Disabling bot spawning.");
            config_json_1.default.bot_spawns.enabled = false;
        }
        if (config_json_1.default.bot_spawns.enabled && presptModLoader.getImportedModsNames().includes("DewardianDev-MOAR")) {
            this.commonUtils.logWarning("MOAR Detected. Disabling bot spawning.");
            config_json_1.default.bot_spawns.enabled = false;
        }
        if (config_json_1.default.bot_spawns.enabled && presptModLoader.getImportedModsNames().includes("PreyToLive-BetterSpawnsPlus")) {
            this.commonUtils.logWarning("BetterSpawnsPlus Detected. Disabling bot spawning.");
            config_json_1.default.bot_spawns.enabled = false;
        }
        if (presptModLoader.getImportedModsNames().includes("Andrudis-QuestManiac")) {
            this.commonUtils.logWarning("QuestManiac Detected. This mod is known to cause performance issues when used with QuestingBots. No support will be provided.");
        }
        // Make Questing Bots control PScav spawning
        if (config_json_1.default.adjust_pscav_chance.enabled || (config_json_1.default.bot_spawns.enabled && config_json_1.default.bot_spawns.player_scavs.enabled)) {
            this.iBotConfig.chanceAssaultScavHasPlayerScavName = 0;
        }
        if (!config_json_1.default.bot_spawns.enabled) {
            return;
        }
        this.commonUtils.logInfo("Configuring game for bot spawning...");
        // Store the current PMC-conversion chances in case they need to be restored later
        this.setOriginalPMCConversionChances();
        // Currently these are all PMC waves, which are unnecessary with PMC spawns in this mod
        this.disableCustomBossWaves();
        // Disable all of the extra Scavs that spawn into Factory
        this.disableCustomScavWaves();
        // If Rogues don't spawn immediately, PMC spawns will be significantly delayed
        if (config_json_1.default.bot_spawns.limit_initial_boss_spawns.disable_rogue_delay) {
            this.commonUtils.logInfo("Removing SPT Rogue spawn delay...");
            this.iLocationConfig.rogueLighthouseSpawnTimeSettings.waitTimeSeconds = -1;
        }
        if (config_json_1.default.bot_spawns.advanced_eft_bot_count_management.enabled) {
            this.commonUtils.logInfo("Enabling advanced_eft_bot_count_management will instruct EFT to ignore this mod's PMC's and PScavs when spawning more bots.");
            this.useEFTBotCaps();
            this.modifyNonWaveBotSpawnSettings();
        }
        if (config_json_1.default.bot_spawns.bot_cap_adjustments.enabled) {
            this.increaseBotCaps();
        }
        this.commonUtils.logInfo("Configuring game for bot spawning...done.");
    }
    updateScavTimer(sessionId) {
        const pmcData = this.profileHelper.getPmcProfile(sessionId);
        const scavData = this.profileHelper.getScavProfile(sessionId);
        if ((scavData.Info === null) || (scavData.Info === undefined)) {
            this.commonUtils.logInfo("Scav profile hasn't been created yet.");
            return;
        }
        // In case somebody disables scav runs and later wants to enable them, we need to reset their Scav timer unless it's plausible
        const worstCooldownFactor = this.getWorstSavageCooldownModifier();
        if (scavData.Info.SavageLockTime - pmcData.Info.LastTimePlayedAsSavage > this.databaseTables.globals.config.SavagePlayCooldown * worstCooldownFactor * 1.1) {
            this.commonUtils.logInfo(`Resetting scav timer for sessionId=${sessionId}...`);
            scavData.Info.SavageLockTime = 0;
        }
    }
    // Return the highest Scav cooldown factor from Fence's rep levels
    getWorstSavageCooldownModifier() {
        // Initialize the return value at something very low
        let worstCooldownFactor = 0.01;
        for (const level in this.databaseTables.globals.config.FenceSettings.Levels) {
            if (this.databaseTables.globals.config.FenceSettings.Levels[level].SavageCooldownModifier > worstCooldownFactor)
                worstCooldownFactor = this.databaseTables.globals.config.FenceSettings.Levels[level].SavageCooldownModifier;
        }
        return worstCooldownFactor;
    }
    setOriginalPMCConversionChances() {
        // Store the default PMC-conversion chances for each bot type defined in SPT's configuration file
        let logMessage = "";
        for (const pmcType in this.iPmcConfig.convertIntoPmcChance) {
            if (this.convertIntoPmcChanceOrig[pmcType] !== undefined) {
                logMessage += `${pmcType}: already buffered, `;
                continue;
            }
            const chances = {
                min: this.iPmcConfig.convertIntoPmcChance[pmcType].min,
                max: this.iPmcConfig.convertIntoPmcChance[pmcType].max
            };
            this.convertIntoPmcChanceOrig[pmcType] = chances;
            logMessage += `${pmcType}: ${chances.min}-${chances.max}%, `;
        }
        this.commonUtils.logInfo(`Reading default PMC spawn chances: ${logMessage}`);
    }
    adjustPmcConversionChance(scalingFactor, verify) {
        // Adjust the chances for each applicable bot type
        let logMessage = "";
        let verified = true;
        for (const pmcType in this.iPmcConfig.convertIntoPmcChance) {
            // Do not allow the chances to exceed 100%. Who knows what might happen...
            const min = Math.round(Math.min(100, this.convertIntoPmcChanceOrig[pmcType].min * scalingFactor));
            const max = Math.round(Math.min(100, this.convertIntoPmcChanceOrig[pmcType].max * scalingFactor));
            if (verify) {
                if (this.iPmcConfig.convertIntoPmcChance[pmcType].min !== min) {
                    verified = false;
                    break;
                }
                if (this.iPmcConfig.convertIntoPmcChance[pmcType].max !== max) {
                    verified = false;
                    break;
                }
            }
            else {
                this.iPmcConfig.convertIntoPmcChance[pmcType].min = min;
                this.iPmcConfig.convertIntoPmcChance[pmcType].max = max;
                logMessage += `${pmcType}: ${min}-${max}%, `;
            }
        }
        if (!verify) {
            this.commonUtils.logInfo(`Adjusting PMC spawn chances (${scalingFactor}): ${logMessage}`);
        }
        if (!verified) {
            this.commonUtils.logError("Another mod has changed the PMC conversion chances. This mod may not work properly!");
        }
    }
    disableCustomBossWaves() {
        this.commonUtils.logInfo("Disabling custom boss waves...");
        this.iLocationConfig.customWaves.boss = {};
    }
    disableCustomScavWaves() {
        this.commonUtils.logInfo("Disabling custom Scav waves...");
        this.iLocationConfig.customWaves.normal = {};
    }
    increaseBotCaps() {
        if (!config_json_1.default.bot_spawns.bot_cap_adjustments.add_max_players_to_bot_cap) {
            return;
        }
        const maxAddtlBots = config_json_1.default.bot_spawns.bot_cap_adjustments.max_additional_bots;
        const maxTotalBots = config_json_1.default.bot_spawns.bot_cap_adjustments.max_total_bots;
        this.iBotConfig.maxBotCap.factory4_day = Math.min(this.iBotConfig.maxBotCap.factory4_day + Math.min(this.databaseTables.locations.factory4_day.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.factory4_night = Math.min(this.iBotConfig.maxBotCap.factory4_night + Math.min(this.databaseTables.locations.factory4_night.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.bigmap = Math.min(this.iBotConfig.maxBotCap.bigmap + Math.min(this.databaseTables.locations.bigmap.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.woods = Math.min(this.iBotConfig.maxBotCap.woods + Math.min(this.databaseTables.locations.woods.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.shoreline = Math.min(this.iBotConfig.maxBotCap.shoreline + Math.min(this.databaseTables.locations.shoreline.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.lighthouse = Math.min(this.iBotConfig.maxBotCap.lighthouse + Math.min(this.databaseTables.locations.lighthouse.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.rezervbase = Math.min(this.iBotConfig.maxBotCap.rezervbase + Math.min(this.databaseTables.locations.rezervbase.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.interchange = Math.min(this.iBotConfig.maxBotCap.interchange + Math.min(this.databaseTables.locations.interchange.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.laboratory = Math.min(this.iBotConfig.maxBotCap.laboratory + Math.min(this.databaseTables.locations.laboratory.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.tarkovstreets = Math.min(this.iBotConfig.maxBotCap.tarkovstreets + Math.min(this.databaseTables.locations.tarkovstreets.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.sandbox = Math.min(this.iBotConfig.maxBotCap.sandbox + Math.min(this.databaseTables.locations.sandbox.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.sandbox_high = Math.min(this.iBotConfig.maxBotCap.sandbox_high + Math.min(this.databaseTables.locations.sandbox_high.base.MaxPlayers, maxAddtlBots), maxTotalBots);
        this.iBotConfig.maxBotCap.default = Math.min(this.iBotConfig.maxBotCap.default + maxAddtlBots, maxTotalBots);
        for (const location in this.iBotConfig.maxBotCap) {
            this.commonUtils.logInfo(`Changed bot cap for ${location} to: ${this.iBotConfig.maxBotCap[location]}`);
        }
    }
    removeBlacklistedBrainTypes() {
        const badBrains = config_json_1.default.bot_spawns.blacklisted_pmc_bot_brains;
        this.commonUtils.logInfo("Removing blacklisted brain types from being used for PMC's...");
        let removedBrains = 0;
        for (const pmcType in this.iPmcConfig.pmcType) {
            for (const map in this.iPmcConfig.pmcType[pmcType]) {
                const mapBrains = this.iPmcConfig.pmcType[pmcType][map];
                for (const i in badBrains) {
                    if (mapBrains[badBrains[i]] === undefined) {
                        continue;
                    }
                    //this.commonUtils.logInfo(`Removing ${badBrains[i]} from ${pmcType} in ${map}...`);
                    delete mapBrains[badBrains[i]];
                    removedBrains++;
                }
            }
        }
        this.commonUtils.logInfo(`Removing blacklisted brain types from being used for PMC's...done. Removed entries: ${removedBrains}`);
    }
    forceFullLengthScavRaids() {
        this.commonUtils.logInfo("Forcing full-length Scav raids...");
        for (const map in this.iLocationConfig.scavRaidTimeSettings.maps) {
            this.iLocationConfig.scavRaidTimeSettings.maps[map].reducedChancePercent = 0;
        }
    }
    async generateBots(info, sessionID, shouldBePScavGroup) {
        const bots = await this.botController.generate(sessionID, info);
        if (!shouldBePScavGroup) {
            return bots;
        }
        const pmcNames = [
            ...this.databaseTables.bots.types.usec.firstName,
            ...this.databaseTables.bots.types.bear.firstName
        ];
        for (const bot in bots) {
            if (info.conditions[0].Role !== "assault") {
                continue;
            }
            bots[bot].Info.Nickname = `${bots[bot].Info.Nickname} (${this.randomUtil.getArrayValue(pmcNames)})`;
        }
        return bots;
    }
    doesFileIntegrityCheckPass() {
        const path = `${__dirname}/..`;
        if (this.vfs.exists(`${path}/quests/`)) {
            this.commonUtils.logWarning("Found obsolete quests folder 'user\\mods\\DanW-SPTQuestingBots\\quests'. Only quest files in 'BepInEx\\plugins\\DanW-SPTQuestingBots\\quests' will be used.");
        }
        if (this.vfs.exists(`${path}/log/`)) {
            this.commonUtils.logWarning("Found obsolete log folder 'user\\mods\\DanW-SPTQuestingBots\\log'. Logs are now saved in 'BepInEx\\plugins\\DanW-SPTQuestingBots\\log'.");
        }
        if (this.vfs.exists(`${path}/../../../BepInEx/plugins/SPTQuestingBots.dll`)) {
            this.commonUtils.logError("Please remove BepInEx/plugins/SPTQuestingBots.dll from the previous version of this mod and restart the server, or it will NOT work correctly.");
            return false;
        }
        return true;
    }
    useEFTBotCaps() {
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.use_EFT_bot_caps) {
            return;
        }
        this.commonUtils.logInfo(`Original bot counts for Factory Day - SPT: ${this.iBotConfig.maxBotCap.factory4_day}, EFT: ${this.databaseTables.locations.factory4_day.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Factory Night - SPT: ${this.iBotConfig.maxBotCap.factory4_night}, EFT: ${this.databaseTables.locations.factory4_night.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Customs - SPT: ${this.iBotConfig.maxBotCap.bigmap}, EFT: ${this.databaseTables.locations.bigmap.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Woods - SPT: ${this.iBotConfig.maxBotCap.woods}, EFT: ${this.databaseTables.locations.woods.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Shoreline - SPT: ${this.iBotConfig.maxBotCap.shoreline}, EFT: ${this.databaseTables.locations.shoreline.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Lighthouse - SPT: ${this.iBotConfig.maxBotCap.lighthouse}, EFT: ${this.databaseTables.locations.lighthouse.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Reserve - SPT: ${this.iBotConfig.maxBotCap.rezervbase}, EFT: ${this.databaseTables.locations.rezervbase.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Interchange - SPT: ${this.iBotConfig.maxBotCap.interchange}, EFT: ${this.databaseTables.locations.interchange.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Labs - SPT: ${this.iBotConfig.maxBotCap.laboratory}, EFT: ${this.databaseTables.locations.laboratory.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Streets - SPT: ${this.iBotConfig.maxBotCap.tarkovstreets}, EFT: ${this.databaseTables.locations.tarkovstreets.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Ground Zero - SPT: ${this.iBotConfig.maxBotCap.sandbox}, EFT: ${this.databaseTables.locations.sandbox.base.BotMax}`);
        this.commonUtils.logInfo(`Original bot counts for Ground Zero (20+) - SPT: ${this.iBotConfig.maxBotCap.sandbox_high}, EFT: ${this.databaseTables.locations.sandbox_high.base.BotMax}`);
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.factory4_day > this.databaseTables.locations.factory4_day.base.BotMax)) {
            this.iBotConfig.maxBotCap.factory4_day = this.databaseTables.locations.factory4_day.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.factory4_night > this.databaseTables.locations.factory4_night.base.BotMax)) {
            this.iBotConfig.maxBotCap.factory4_night = this.databaseTables.locations.factory4_night.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.bigmap > this.databaseTables.locations.bigmap.base.BotMax)) {
            this.iBotConfig.maxBotCap.bigmap = this.databaseTables.locations.bigmap.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.woods > this.databaseTables.locations.woods.base.BotMax)) {
            this.iBotConfig.maxBotCap.woods = this.databaseTables.locations.woods.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.shoreline > this.databaseTables.locations.shoreline.base.BotMax)) {
            this.iBotConfig.maxBotCap.shoreline = this.databaseTables.locations.shoreline.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.lighthouse > this.databaseTables.locations.lighthouse.base.BotMax)) {
            this.iBotConfig.maxBotCap.lighthouse = this.databaseTables.locations.lighthouse.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.rezervbase > this.databaseTables.locations.rezervbase.base.BotMax)) {
            this.iBotConfig.maxBotCap.rezervbase = this.databaseTables.locations.rezervbase.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.interchange > this.databaseTables.locations.interchange.base.BotMax)) {
            this.iBotConfig.maxBotCap.interchange = this.databaseTables.locations.interchange.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.laboratory > this.databaseTables.locations.laboratory.base.BotMax)) {
            this.iBotConfig.maxBotCap.laboratory = this.databaseTables.locations.laboratory.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.tarkovstreets > this.databaseTables.locations.tarkovstreets.base.BotMax)) {
            this.iBotConfig.maxBotCap.tarkovstreets = this.databaseTables.locations.tarkovstreets.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.sandbox > this.databaseTables.locations.sandbox.base.BotMax)) {
            this.iBotConfig.maxBotCap.sandbox = this.databaseTables.locations.sandbox.base.BotMax;
        }
        if (!config_json_1.default.bot_spawns.advanced_eft_bot_count_management.only_decrease_bot_caps || (this.iBotConfig.maxBotCap.sandbox_high > this.databaseTables.locations.sandbox_high.base.BotMax)) {
            this.iBotConfig.maxBotCap.sandbox_high = this.databaseTables.locations.sandbox_high.base.BotMax;
        }
        this.iBotConfig.maxBotCap.factory4_day += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.factory4_day;
        this.iBotConfig.maxBotCap.factory4_night += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.factory4_night;
        this.iBotConfig.maxBotCap.bigmap += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.bigmap;
        this.iBotConfig.maxBotCap.woods += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.woods;
        this.iBotConfig.maxBotCap.shoreline += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.shoreline;
        this.iBotConfig.maxBotCap.lighthouse += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.lighthouse;
        this.iBotConfig.maxBotCap.rezervbase += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.rezervbase;
        this.iBotConfig.maxBotCap.interchange += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.interchange;
        this.iBotConfig.maxBotCap.laboratory += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.laboratory;
        this.iBotConfig.maxBotCap.tarkovstreets += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.tarkovstreets;
        this.iBotConfig.maxBotCap.sandbox += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.sandbox;
        this.iBotConfig.maxBotCap.sandbox_high += config_json_1.default.bot_spawns.advanced_eft_bot_count_management.bot_cap_adjustments.sandbox_high;
        this.commonUtils.logInfo(`Updated bot counts for Factory Day - SPT: ${this.iBotConfig.maxBotCap.factory4_day}, EFT: ${this.databaseTables.locations.factory4_day.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Factory Night - SPT: ${this.iBotConfig.maxBotCap.factory4_night}, EFT: ${this.databaseTables.locations.factory4_night.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Customs - SPT: ${this.iBotConfig.maxBotCap.bigmap}, EFT: ${this.databaseTables.locations.bigmap.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Woods - SPT: ${this.iBotConfig.maxBotCap.woods}, EFT: ${this.databaseTables.locations.woods.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Shoreline - SPT: ${this.iBotConfig.maxBotCap.shoreline}, EFT: ${this.databaseTables.locations.shoreline.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Lighthouse - SPT: ${this.iBotConfig.maxBotCap.lighthouse}, EFT: ${this.databaseTables.locations.lighthouse.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Reserve - SPT: ${this.iBotConfig.maxBotCap.rezervbase}, EFT: ${this.databaseTables.locations.rezervbase.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Interchange - SPT: ${this.iBotConfig.maxBotCap.interchange}, EFT: ${this.databaseTables.locations.interchange.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Labs - SPT: ${this.iBotConfig.maxBotCap.laboratory}, EFT: ${this.databaseTables.locations.laboratory.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Streets - SPT: ${this.iBotConfig.maxBotCap.tarkovstreets}, EFT: ${this.databaseTables.locations.tarkovstreets.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Ground Zero - SPT: ${this.iBotConfig.maxBotCap.sandbox}, EFT: ${this.databaseTables.locations.sandbox.base.BotMax}`);
        this.commonUtils.logInfo(`Updated bot counts for Ground Zero (20+) - SPT: ${this.iBotConfig.maxBotCap.sandbox_high}, EFT: ${this.databaseTables.locations.sandbox_high.base.BotMax}`);
    }
    modifyNonWaveBotSpawnSettings() {
        /*this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Factory Day : ${this.databaseTables.locations.factory4_day.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Factory Night : ${this.databaseTables.locations.factory4_night.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Customs : ${this.databaseTables.locations.bigmap.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Woods : ${this.databaseTables.locations.woods.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Shoreline : ${this.databaseTables.locations.shoreline.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Lighthouse : ${this.databaseTables.locations.lighthouse.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Reserve : ${this.databaseTables.locations.rezervbase.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Interchange : ${this.databaseTables.locations.interchange.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Labs : ${this.databaseTables.locations.laboratory.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Streets : ${this.databaseTables.locations.tarkovstreets.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Ground Zero : ${this.databaseTables.locations.sandbox.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Original BotSpawnPeriodCheck for Ground Zero (20+) : ${this.databaseTables.locations.sandbox_high.base.BotSpawnPeriodCheck}`);*/
        this.databaseTables.locations.factory4_day.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.factory4_night.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.bigmap.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.woods.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.shoreline.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.lighthouse.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.rezervbase.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.interchange.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.laboratory.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.tarkovstreets.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.sandbox.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.databaseTables.locations.sandbox_high.base.BotSpawnPeriodCheck *= config_json_1.default.bot_spawns.non_wave_bot_spawn_period_factor;
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Factory Day : ${this.databaseTables.locations.factory4_day.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Factory Night : ${this.databaseTables.locations.factory4_night.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Customs : ${this.databaseTables.locations.bigmap.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Woods : ${this.databaseTables.locations.woods.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Shoreline : ${this.databaseTables.locations.shoreline.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Lighthouse : ${this.databaseTables.locations.lighthouse.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Reserve : ${this.databaseTables.locations.rezervbase.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Interchange : ${this.databaseTables.locations.interchange.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Labs : ${this.databaseTables.locations.laboratory.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Streets : ${this.databaseTables.locations.tarkovstreets.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Ground Zero : ${this.databaseTables.locations.sandbox.base.BotSpawnPeriodCheck}`);
        this.commonUtils.logInfo(`Updated BotSpawnPeriodCheck for Ground Zero (20+) : ${this.databaseTables.locations.sandbox_high.base.BotSpawnPeriodCheck}`);
    }
}
module.exports = { mod: new QuestingBots() };
//# sourceMappingURL=mod.js.map