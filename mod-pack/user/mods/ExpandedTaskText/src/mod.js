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
const path = __importStar(require("node:path"));
const config = __importStar(require("../config/config.json"));
const gsEN = __importStar(require("../db/GunsmithLocaleEN.json"));
const InstanceManager_1 = require("./InstanceManager");
const LogTextColor_1 = require("/snapshot/project/obj/models/spt/logging/LogTextColor");
class DExpandedTaskText {
    Instance = new InstanceManager_1.InstanceManager();
    modName = "ExpandedTaskText";
    dbPath = path.join(path.dirname(__filename), "..", "db");
    tasks;
    locale;
    QuestInfo;
    timeGateUnlocktimes = [];
    preSptLoad(container) {
        this.Instance.preSptLoad(container, this.modName);
    }
    postDBLoad(container) {
        const startTime = performance.now();
        this.Instance.postDBLoad(container);
        this.Instance.logger.log("Expanded Task Text is loading please wait...", LogTextColor_1.LogTextColor.GREEN);
        this.QuestInfo = this.loadJsonFile(path.join(this.dbPath, "QuestInfo.json"));
        this.getAllTasks(this.Instance.database);
        this.updateAllTasksText();
        const endTime = performance.now();
        const startupTime = (endTime - startTime) / 1000;
        this.Instance.logger.log(`Expanded Task Text startup took ${startupTime} seconds...`, LogTextColor_1.LogTextColor.GREEN);
    }
    /**
     * Loads and parses a config file from disk
     * @param fileName File name inside of config folder to load
     */
    loadJsonFile(filePath, readAsText = false) {
        const file = path.join(filePath);
        const string = this.Instance.vfs.readFile(file);
        return readAsText
            ? string
            : JSON.parse(string);
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
                    const nextQuestName = this.locale.en[`${key} name`];
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
            let partString = this.locale.en[`${part} Name`];
            for (const trader in traders) {
                for (let i = 0; i < traders[trader]?.assort?.items.length; i++) {
                    if (part === traders[trader].assort.items[i]._tpl && loyalLevelItems[traders[trader].assort.items[i]._id] !== undefined) {
                        partString += `\n    Sold by (${this.locale.en[`${trader} Nickname`]} LL ${loyalLevelItems[traders[trader].assort.items[i]._id]})`;
                    }
                }
            }
            localizedParts.push(partString);
        }
        return localizedParts.join("\n\n");
    }
    buildKeyText(objectives, localeId) {
        let keyDesc = "";
        for (const obj of objectives) {
            if (obj.requiredKeys === undefined)
                continue;
            const objDesc = this.locale[localeId][`${obj.id}`];
            let keys = "";
            for (const keysInObj in obj.requiredKeys) {
                for (const key in obj.requiredKeys[keysInObj]) {
                    const localeKey = `${obj.requiredKeys[keysInObj][key]["id"]} Name`;
                    const localEntry = this.locale[localeId][localeKey];
                    if (localeKey === undefined || localEntry === undefined)
                        continue;
                    keys += `    ${localEntry}\n`;
                }
            }
            if (keys.length === 0)
                continue;
            keyDesc += `${objDesc}\n Requires key(s):\n${keys}`;
        }
        return keyDesc;
    }
    updateAllTasksText() {
        const questInfo = this.QuestInfo;
        for (const info of questInfo) {
            for (const localeID in this.locale) {
                const originalDesc = this.locale[localeID][`${info.id} description`];
                let keyDesc = this.buildKeyText(info.objectives, localeID);
                let collector;
                let lightKeeper;
                let durability;
                let requiredParts;
                let timeUntilNext;
                let leadsTo;
                if (config.ShowCollectorRequirements && info.kappaRequired) {
                    collector = "This quest is required for Collector \n \n";
                }
                if (config.ShowLightKeeperRequirements && info.lightkeeperRequired) {
                    lightKeeper = "This quest is required for Lightkeeper \n \n";
                }
                const nextQuest = this.getAllNextQuestsInChain(info.id);
                if (nextQuest.length > 0 && config.ShowNextQuestInChain) {
                    leadsTo = `Leads to: ${nextQuest} \n \n`;
                }
                else if (config.ShowNextQuestInChain) {
                    leadsTo = "Leads to: Nothing \n \n";
                }
                else {
                    leadsTo = "";
                }
                if (gsEN[info.id]?.RequiredParts !== undefined && config.ShowGunsmithRequiredParts) {
                    durability = "Required Durability: 60 \n";
                    requiredParts = `${this.getAndBuildPartsList(info.id)} \n \n`;
                }
                if (config.ShowTimeUntilNextQuest) {
                    for (const req of this.timeGateUnlocktimes) {
                        if (req.currentQuest === info.id) {
                            timeUntilNext = `Hours until ${this.locale.en[`${req.nextQuest} name`]} unlocks after completion: ${req.time} \n \n`;
                        }
                    }
                }
                if (keyDesc === undefined) {
                    keyDesc = "";
                }
                if (collector === undefined) {
                    collector = "";
                }
                if (lightKeeper === undefined) {
                    lightKeeper = "";
                }
                if (requiredParts === undefined) {
                    requiredParts = "";
                }
                if (durability === undefined) {
                    durability = "";
                }
                if (timeUntilNext === undefined) {
                    timeUntilNext = "";
                }
                // biome-ignore lint/style/useTemplate: <>
                this.locale[localeID][`${info.id} description`] = collector + lightKeeper + leadsTo + timeUntilNext + (keyDesc.length > 0 ? `${keyDesc} \n` : "") + durability + requiredParts + originalDesc;
            }
        }
    }
}
module.exports = { mod: new DExpandedTaskText() };
//# sourceMappingURL=mod.js.map