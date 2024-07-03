"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const config = __importStar(require("../config/config.json"));
const dbEN = __importStar(require("../db/LocaleEN.json"));
const gsEN = __importStar(require("../db/GunsmithLocaleEN.json"));
const InstanceManager_1 = require("./InstanceManager");
const LogTextColor_1 = require("/snapshot/project/obj/models/spt/logging/LogTextColor");
class TimeGateUnlockRequirementsImpl {
    currentQuest;
    nextQuest;
    time;
    constructor(currentQuest, nextQuest, time) {
        this.currentQuest = currentQuest;
        this.nextQuest = nextQuest;
        this.time = time;
    }
}
class DExpandedTaskText {
    Instance = new InstanceManager_1.InstanceManager();
    modName = "ExpandedTaskText";
    tasks;
    locale;
    timeGateUnlocktimes = [];
    requiredQuestsForCollector = [];
    requiredQuestsForLightKeeper = []; //TODO this still doesnt work properly
    tasksHash;
    configHash;
    cache;
    preAkiLoad(container) {
        this.Instance.preAkiLoad(container, this.modName);
    }
    postDBLoad(container) {
        const startTime = performance.now();
        this.Instance.postDBLoad(container);
        this.Instance.logger.log("Expanded Task Text is loading please wait...", LogTextColor_1.LogTextColor.GREEN);
        this.getAllTasks(this.Instance.database);
        this.getHashes();
        if (this.isCacheValid()) {
            for (const localeID in this.locale) {
                for (const questDesc in this.cache.locale[localeID]) {
                    this.locale[localeID][questDesc] = this.cache.locale[localeID][questDesc];
                }
            }
        }
        else {
            this.cache = {
                tasksHash: this.tasksHash,
                configHash: this.configHash,
                locale: {}
            };
            for (const localeID in this.locale) {
                this.cache.locale[localeID] = {};
            }
            this.getAllRequiredQuestsForQuest("5c51aac186f77432ea65c552", this.requiredQuestsForCollector);
            //this.getAllRequiredQuestsForQuest("625d6ff5ddc94657c21a1625", this.requiredQuestsForLightKeeper);
            this.getAllQuestsWithTimeRequirements();
            this.updateAllTasksText(this.Instance.database);
            fs.writeFileSync(this.Instance.cachePath, this.Instance.jsonUtil.serialize(this.cache, true));
        }
        const endTime = performance.now();
        const startupTime = (endTime - startTime) / 1000;
        this.Instance.logger.log(`Expanded Task Text startup took ${startupTime} seconds...`, LogTextColor_1.LogTextColor.GREEN);
    }
    getHashes() {
        const tasksString = this.Instance.jsonUtil.serialize(this.tasks);
        const configString = this.Instance.jsonUtil.serialize(config);
        this.tasksHash = this.Instance.hashUtil.generateHashForData("sha1", tasksString);
        this.configHash = this.Instance.hashUtil.generateHashForData("sha1", configString);
    }
    isCacheValid() {
        if (!fs.existsSync(this.Instance.cachePath)) {
            this.Instance.logger.log("Cache not found. Processing tasks.", LogTextColor_1.LogTextColor.GREEN);
            return false;
        }
        this.cache = JSON.parse(fs.readFileSync(this.Instance.cachePath, "utf-8"));
        if (this.cache.tasksHash == this.tasksHash && this.cache.configHash == this.configHash) {
            this.Instance.logger.log("Valid cache found. Merging saved tasks.", LogTextColor_1.LogTextColor.GREEN);
            return true;
        }
        else {
            this.Instance.logger.log("Invalid cache found. Processing tasks.", LogTextColor_1.LogTextColor.GREEN);
            return false;
        }
    }
    getAllTasks(database) {
        this.tasks = database.templates.quests;
        this.locale = database.locales.global;
    }
    getAllNextQuestsInChain(currentQuestId) {
        const nextQuests = [];
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.keys(this.tasks).forEach(key => {
            if (this.tasks[key].conditions.AvailableForStart === undefined) {
                return undefined;
            }
            const conditionsAOS = this.tasks[key].conditions.AvailableForStart;
            for (const condition in conditionsAOS) {
                if (conditionsAOS[condition]?.conditionType === "Quest" && conditionsAOS[condition]?.target === currentQuestId) {
                    const nextQuestName = this.locale["en"][`${key} name`];
                    nextQuests.push(nextQuestName);
                    // Recursively find the next quests for the current quest
                    const recursiveResults = this.getAllNextQuestsInChain(nextQuestName);
                    nextQuests.push(...recursiveResults);
                }
            }
        });
        const resultString = nextQuests.join(", ");
        return resultString;
    }
    getAllRequiredQuestsForQuest(QuestId, list) {
        const results = [];
        const conditionsAOS = this.tasks[QuestId].conditions.AvailableForStart;
        for (const condition in conditionsAOS) {
            if (conditionsAOS[condition]?.conditionType === "Quest") {
                if (this.requiredQuestsForCollector.includes(conditionsAOS[condition].target)) {
                    //this.Instance.logger.log(`Skipping adding ${this.tasks[conditionsAOS[condition].target as string].QuestName}`, LogTextColor.GREEN);
                    continue;
                }
                //this.Instance.logger.log(`Adding ${this.tasks[conditionsAOS[condition].target as string].QuestName}`, LogTextColor.GREEN);
                list.push(conditionsAOS[condition]?.target);
                // Recursively find the next quests for the current quest
                const recursiveResults = this.getAllRequiredQuestsForQuest(conditionsAOS[condition]?.target, list);
                results.push(...recursiveResults);
            }
        }
        return results;
    }
    getAllQuestsWithTimeRequirements() {
        const tasks = this.tasks;
        for (const task in tasks) {
            const conditionsAOS = tasks[task].conditions.AvailableForStart;
            for (const condition in conditionsAOS) {
                if (conditionsAOS[condition]?.conditionType === "Quest" && conditionsAOS[condition]?.availableAfter > 0) {
                    const hours = conditionsAOS[condition].availableAfter / 3600;
                    const data = new TimeGateUnlockRequirementsImpl(conditionsAOS[condition].target, task, hours);
                    this.timeGateUnlocktimes.push(data);
                }
            }
        }
    }
    getAllTraderLoyalLevelItems() {
        const traders = this.Instance.database.traders;
        const loyalLevelItems = {};
        for (const trader in traders) {
            for (const assortItem in traders[trader]?.assort?.loyal_level_items) {
                loyalLevelItems[assortItem] = traders[trader].assort.loyal_level_items[assortItem];
            }
        }
        return loyalLevelItems;
    }
    getAndBuildPartsList(taskId) {
        const partIds = gsEN[taskId]?.RequiredParts;
        const localizedParts = [];
        const traders = this.Instance.database.traders;
        const loyalLevelItems = this.getAllTraderLoyalLevelItems();
        if (partIds.length === 0) {
            return "";
        }
        for (const part of partIds) {
            let partString = this.locale["en"][`${part} Name`];
            for (const trader in traders) {
                for (let i = 0; i < traders[trader]?.assort?.items.length; i++) {
                    if (part == traders[trader].assort.items[i]._tpl && loyalLevelItems[traders[trader].assort.items[i]._id] !== undefined) {
                        partString += `\n    Sold by (${this.locale["en"][`${trader} Nickname`]} LL ${loyalLevelItems[traders[trader].assort.items[i]._id]})`;
                    }
                }
            }
            localizedParts.push(partString);
        }
        return localizedParts.join("\n\n");
    }
    updateAllTasksText(database) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.keys(this.tasks).forEach(key => {
            for (const localeID in this.locale) {
                const originalDesc = this.locale[localeID][`${key} description`];
                let keyDesc;
                let collector;
                let lightKeeper;
                let durability;
                let requiredParts;
                let timeUntilNext;
                let leadsTo;
                if (dbEN[key]?.IsKeyRequired == true && this.tasks[key]?._id == key) {
                    if (dbEN[key]?.OptionalKey == "") {
                        keyDesc = `Required key(s): ${dbEN[key].RequiredKey} \n \n`;
                    }
                    else if (dbEN[key]?.RequiredKey == "") {
                        keyDesc = `Optional key(s): ${dbEN[key].OptionalKey} \n \n`;
                    }
                    else {
                        keyDesc = `Required Key(s):  ${dbEN[key].RequiredKey} \n Optional Key(s): ${dbEN[key].OptionalKey} \n \n`;
                    }
                }
                if (this.requiredQuestsForCollector.includes(key) && config.ShowCollectorRequirements) {
                    collector = "This quest is required for Collector \n \n";
                }
                /*
                if (this.requiredQuestsForLightKeeper.includes(key) && config.ShowLightKeeperRequirements)
                {
                    lightKeeper = "This quest is required for Lightkeeper \n \n";
                }
                */
                const nextQuest = this.getAllNextQuestsInChain(key);
                if (nextQuest.length > 0 && config.ShowNextQuestInChain) {
                    leadsTo = `Leads to: ${nextQuest} \n \n`;
                }
                else if (config.ShowNextQuestInChain) {
                    leadsTo = "Leads to: Nothing \n \n";
                }
                else {
                    leadsTo = "";
                }
                if (gsEN[key]?.RequiredParts !== undefined && config.ShowGunsmithRequiredParts) {
                    durability = "Required Durability: 60 \n";
                    requiredParts = `${this.getAndBuildPartsList(key)} \n \n`;
                }
                if (config.ShowTimeUntilNextQuest) {
                    for (const req of this.timeGateUnlocktimes) {
                        if (req.currentQuest === key) {
                            timeUntilNext = `Hours until ${this.locale["en"][`${req.nextQuest} name`]} unlocks after completion: ${req.time} \n \n`;
                        }
                    }
                }
                if (keyDesc == undefined) {
                    keyDesc = "";
                }
                if (collector == undefined) {
                    collector = "";
                }
                if (lightKeeper == undefined) {
                    lightKeeper = "";
                }
                if (requiredParts == undefined) {
                    requiredParts = "";
                }
                if (durability == undefined) {
                    durability = "";
                }
                if (timeUntilNext == undefined) {
                    timeUntilNext = "";
                }
                if (!this.Instance.getPath()) {
                    database.locales.global[localeID][`${key} description`] = collector + lightKeeper + leadsTo + timeUntilNext + keyDesc + durability + requiredParts + originalDesc;
                    this.cache.locale[localeID][`${key} description`] = database.locales.global[localeID][`${key} description`];
                }
            }
        });
    }
}
module.exports = { mod: new DExpandedTaskText() };
//# sourceMappingURL=mod.js.map