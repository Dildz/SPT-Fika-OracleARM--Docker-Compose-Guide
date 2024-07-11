"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
// Custom Classes
const MyCustomProfileCallbacks_1 = require("./MyCustomProfileCallbacks");
const MyCustomProfileController_1 = require("./MyCustomProfileController");
const MyCustomLocationGenerator_1 = require("./MyCustomLocationGenerator");
const MyCustomQuestController_1 = require("./MyCustomQuestController");
const MyCustomQuestHelper_1 = require("./MyCustomQuestHelper");
class TemporaryFixes {
    static container;
    preSptLoad(container) {
        const staticRouterModService = container.resolve("StaticRouterModService");
        container.register("MyCustomProfileCallbacks", MyCustomProfileCallbacks_1.MyCustomProfileCallbacks);
        container.register("ProfileCallbacks", { useToken: "MyCustomProfileCallbacks" });
        container.register("MyCustomProfileController", MyCustomProfileController_1.MyCustomProfileController);
        container.register("ProfileController", { useToken: "MyCustomProfileController" });
        container.register("MyCustomLocationGenerator", MyCustomLocationGenerator_1.MyCustomLocationGenerator);
        container.register("LocationGenerator", { useToken: "MyCustomLocationGenerator" });
        container.register("MyCustomQuestController", MyCustomQuestController_1.MyCustomQuestController);
        container.register("QuestController", { useToken: "MyCustomQuestController" });
        container.register("MyCustomQuestHelper", MyCustomQuestHelper_1.MyCustomQuestHelper);
        container.register("QuestHelper", { useToken: "MyCustomQuestHelper" });
        const profileCallbacks = container.resolve("MyCustomProfileCallbacks");
        staticRouterModService.registerStaticRouter("FixProfileSettingsRouter", [
            {
                url: "/client/profile/settings",
                action: async (url, info, sessionId, output) => {
                    const newOutput = profileCallbacks.getProfileSettings(url, info, sessionId);
                    return newOutput;
                }
            }
        ], "spt");
    }
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const giftConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.GIFTS);
        const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const coreConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.CORE);
        const tables = databaseServer.getTables();
        // Fix new figurines to be lootable
        const restrictionsInRaid = tables.globals.config.RestrictionsInRaid;
        const newFigurines = [
            "66572b8d80b1cd4b6a67847f",
            "66572be36a723f7f005a066e",
            "66572cbdad599021091c611a",
            "66572c82ad599021091c6118"
        ];
        for (const restriction in restrictionsInRaid) {
            const isIncluded = newFigurines.some(itemID => restrictionsInRaid[restriction].TemplateId.includes(itemID));
            if (isIncluded) {
                restrictionsInRaid[restriction].MaxInLobby = 0;
                restrictionsInRaid[restriction].MaxInRaid = 100;
            }
        }
        // VALENS Gift Code Fix
        const valensGift = giftConfig.gifts.VALENS;
        for (const item in valensGift.items) {
            // Parent Item
            if (valensGift.items[item]._id == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aafa857e5b5b00018480968") {
                valensGift.items[item]._id = "a89275c1b18274ef7432a6d4";
            }
            // Attachments
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "64b9e2037fdfb81df81e3c25") {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aaf8e43e5b5b00015693246") {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aaf9d53e5b5b00015042a52") {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5abcbb20d8ce87001773e258") {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
        }
        // Fix Unheard Profile Allowing EOD Display
        const unheardProfile = tables.templates.profiles.Unheard;
        if (unheardProfile.bear.character.Info.MemberCategory == 1024) {
            unheardProfile.bear.character.Info.MemberCategory = 1026;
        }
        if (unheardProfile.usec.character.Info.MemberCategory == 1024) {
            unheardProfile.usec.character.Info.MemberCategory = 1026;
        }
        // Fix skier & peacekeeper bots
        const presetBatchFix = botConfig.presetBatch;
        const itemSpawnLimitsFix = botConfig.itemSpawnLimits;
        presetBatchFix["peacemaker"] = 10;
        presetBatchFix["skier"] = 10;
        itemSpawnLimitsFix["peacemaker"] = {};
        itemSpawnLimitsFix["skier"] = {};
        const equipmentFixPeacemaker = {
            "peacemaker": {
                "nvgIsActiveChanceDayPercent": 10,
                "nvgIsActiveChanceNightPercent": 95,
                "faceShieldIsActiveChancePercent": 100,
                "lightIsActiveDayChancePercent": 35,
                "lightIsActiveNightChancePercent": 95,
                "laserIsActiveChancePercent": 95,
                "forceStock": true,
                "weaponModLimits": {
                    "scopeLimit": 1,
                    "lightLaserLimit": 1
                }
            }
        };
        const equipmentFixSkier = {
            "skier": {
                "nvgIsActiveChanceDayPercent": 10,
                "nvgIsActiveChanceNightPercent": 95,
                "faceShieldIsActiveChancePercent": 100,
                "lightIsActiveDayChancePercent": 35,
                "lightIsActiveNightChancePercent": 95,
                "laserIsActiveChancePercent": 95,
                "forceStock": true,
                "weaponModLimits": {
                    "scopeLimit": 1,
                    "lightLaserLimit": 1
                }
            }
        };
        const pkProperties = Object.assign({}, botConfig.equipment, equipmentFixPeacemaker);
        botConfig.equipment = pkProperties;
        const skierProperties = Object.assign({}, botConfig.equipment, equipmentFixSkier);
        botConfig.equipment = skierProperties;
        // Stash row limit change
        const stashFix = coreConfig.features.chatbotFeatures.commandUseLimits;
        stashFix["StashRows"] = 15;
    }
}
exports.mod = new TemporaryFixes();
//# sourceMappingURL=mod.js.map