/* eslint-disable @typescript-eslint/naming-convention */

import * as fs from "fs";
import * as config from "../config/config.json";

import * as dbEN from "../db/LocaleEN.json";
import * as gsEN from "../db/GunsmithLocaleEN.json";

import type { DependencyContainer } from "tsyringe";
import { InstanceManager } from "./InstanceManager";

import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import type { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import type { IQuest } from "@spt-aki/models/eft/common/tables/IQuest";
import { ITrader } from "@spt-aki/models/eft/common/tables/ITrader";


interface TimeGateUnlockRequirements {
    currentQuest: string,
    nextQuest: string,
    time: number
}

class TimeGateUnlockRequirementsImpl implements TimeGateUnlockRequirements {
    constructor(public currentQuest: string, public nextQuest: string, public time: number) {

    }
}

class DExpandedTaskText implements IPostDBLoadMod, IPreAkiLoadMod {
    private Instance: InstanceManager = new InstanceManager();
    private modName = "ExpandedTaskText";

    private tasks: Record<string, IQuest>;
    private locale: Record<string, Record<string, string>>;

    private timeGateUnlocktimes: TimeGateUnlockRequirements[] = [];
    private requiredQuestsForCollector: string[] = [];
    private requiredQuestsForLightKeeper: string[] = []; //TODO this still doesnt work properly
    private tasksHash: string;
    private configHash: string;
    private cache: { tasksHash: string; configHash: string; locale: Record<string, Record<string, string>>; };
    

    public preAkiLoad(container: DependencyContainer): void {
        this.Instance.preAkiLoad(container, this.modName);
    }

    public postDBLoad(container: DependencyContainer): void {
        const startTime = performance.now();

        this.Instance.postDBLoad(container);

        this.Instance.logger.log("Expanded Task Text is loading please wait...", LogTextColor.GREEN);

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

        this.Instance.logger.log(`Expanded Task Text startup took ${startupTime} seconds...`, LogTextColor.GREEN);
    }

    private getHashes(): void {
        const tasksString = this.Instance.jsonUtil.serialize(this.tasks);
        const configString = this.Instance.jsonUtil.serialize(config);
        
        this.tasksHash = this.Instance.hashUtil.generateHashForData("sha1", tasksString);
        this.configHash = this.Instance.hashUtil.generateHashForData("sha1", configString);
    }

    private isCacheValid(): boolean {
        if (!fs.existsSync(this.Instance.cachePath)) {
            this.Instance.logger.log("Cache not found. Processing tasks.", LogTextColor.GREEN);
            return false;
        }
        this.cache = JSON.parse(fs.readFileSync(this.Instance.cachePath, "utf-8"));
		
        if (this.cache.tasksHash == this.tasksHash && this.cache.configHash == this.configHash) {
            this.Instance.logger.log("Valid cache found. Merging saved tasks.", LogTextColor.GREEN);
            return true;
        }
        else {
            this.Instance.logger.log("Invalid cache found. Processing tasks.", LogTextColor.GREEN);
            return false;
        }
    }

    private getAllTasks(database: IDatabaseTables): void {
        this.tasks = database.templates.quests;
        this.locale = database.locales.global;
    }

    private getAllNextQuestsInChain(currentQuestId: string): string | undefined {
        const nextQuests: string[] = [];

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

    private getAllRequiredQuestsForQuest(QuestId: string, list: string[]): string[] {
        const results: string[] = [];
        const conditionsAOS = this.tasks[QuestId].conditions.AvailableForStart;

        for (const condition in conditionsAOS) {
            if (conditionsAOS[condition]?.conditionType === "Quest") {
                if (this.requiredQuestsForCollector.includes(conditionsAOS[condition].target as string)) {
                    //this.Instance.logger.log(`Skipping adding ${this.tasks[conditionsAOS[condition].target as string].QuestName}`, LogTextColor.GREEN);
                    continue;
                }

                //this.Instance.logger.log(`Adding ${this.tasks[conditionsAOS[condition].target as string].QuestName}`, LogTextColor.GREEN);

                list.push(conditionsAOS[condition]?.target as string);

                // Recursively find the next quests for the current quest
                const recursiveResults = this.getAllRequiredQuestsForQuest(conditionsAOS[condition]?.target as string, list);
                results.push(...recursiveResults);
            }
        }
        return results;
    }

    private getAllQuestsWithTimeRequirements() {
        const tasks = this.tasks;

        for (const task in tasks) {
            const conditionsAOS = tasks[task].conditions.AvailableForStart;

            for (const condition in conditionsAOS) {
                if (conditionsAOS[condition]?.conditionType === "Quest" && conditionsAOS[condition]?.availableAfter > 0) {
                    const hours = conditionsAOS[condition].availableAfter / 3600;
                    const data = new TimeGateUnlockRequirementsImpl(conditionsAOS[condition].target as string, task, hours);

                    this.timeGateUnlocktimes.push(data);
                }
            }
        }
    }

    private getAllTraderLoyalLevelItems(): Record<string, number> {
        const traders: Record<string, ITrader> = this.Instance.database.traders;
        const loyalLevelItems: Record<string, number> = {};

        for (const trader in traders) {
            for (const assortItem in traders[trader]?.assort?.loyal_level_items) {
                loyalLevelItems[assortItem] = traders[trader].assort.loyal_level_items[assortItem];
            }
        }

        return loyalLevelItems;
    }

    private getAndBuildPartsList(taskId: string): string {
        const partIds: string[] = gsEN[taskId]?.RequiredParts;
        const localizedParts: string[] = [];

        const traders: Record<string, ITrader> = this.Instance.database.traders;

        const loyalLevelItems: Record<string, number> = this.getAllTraderLoyalLevelItems();

        if (partIds.length === 0) 
        {
            return "";
        }

        for (const part of partIds) 
        {
            let partString = this.locale["en"][`${part} Name`];

            for (const trader in traders) 
            {
                for (let i = 0; i < traders[trader]?.assort?.items.length; i++) 
                {
                    if (part == traders[trader].assort.items[i]._tpl && loyalLevelItems[traders[trader].assort.items[i]._id] !== undefined) 
                    {
                        partString += `\n    Sold by (${this.locale["en"][`${trader} Nickname`]} LL ${loyalLevelItems[traders[trader].assort.items[i]._id]})`;
                    }
                }
            }

            localizedParts.push(partString);
        }

        return localizedParts.join("\n\n");
    }

    private updateAllTasksText(database: IDatabaseTables) {
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
                        keyDesc = `Required Key(s):  ${dbEN[key].RequiredKey} \n Optional Key(s): ${dbEN[key].OptionalKey} \n \n`
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

                const nextQuest: string = this.getAllNextQuestsInChain(key);

                if (nextQuest.length > 0 && config.ShowNextQuestInChain) 
                {
                    leadsTo = `Leads to: ${nextQuest} \n \n`;
                }
                else if (config.ShowNextQuestInChain)
                {
                    leadsTo = "Leads to: Nothing \n \n";
                }
                else
                {
                    leadsTo = "";
                }

                if (gsEN[key]?.RequiredParts !== undefined && config.ShowGunsmithRequiredParts) 
                {
                    durability = "Required Durability: 60 \n";
                    requiredParts = `${this.getAndBuildPartsList(key)} \n \n`;
                }

                if (config.ShowTimeUntilNextQuest) 
                {
                    for (const req of this.timeGateUnlocktimes) 
                    {
                        if (req.currentQuest === key) 
                        {
                            timeUntilNext = `Hours until ${this.locale["en"][`${req.nextQuest} name`]} unlocks after completion: ${req.time} \n \n`;
                        }
                    }
                }

                if (keyDesc == undefined) 
                {
                    keyDesc = "";
                }

                if (collector == undefined) 
                {
                    collector = "";
                }

                if (lightKeeper == undefined) 
                {
                    lightKeeper = "";
                }

                if (requiredParts == undefined) 
                {
                    requiredParts = "";
                }

                if (durability == undefined) 
                {
                    durability = "";
                }

                if (timeUntilNext == undefined) 
                {
                    timeUntilNext = "";
                }

                if (!this.Instance.getPath()) 
                {
                    database.locales.global[localeID][`${key} description`] = collector + lightKeeper + leadsTo + timeUntilNext + keyDesc + durability + requiredParts + originalDesc;
                    this.cache.locale[localeID][`${key} description`] = database.locales.global[localeID][`${key} description`];
                }
            }
        });
    }
}

module.exports = { mod: new DExpandedTaskText() }