/* eslint-disable @typescript-eslint/naming-convention */

import * as path from "node:path";
import * as fs from "node:fs";
import * as config from "../config/config.json";

import * as gsEN from "../db/GunsmithLocaleEN.json";

import type { DependencyContainer } from "tsyringe";
import { InstanceManager } from "./InstanceManager";

import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import type { IQuest } from "@spt/models/eft/common/tables/IQuest";
import type { ITrader } from "@spt/models/eft/common/tables/ITrader";
import type { IObjective, IQuestInfoModel } from "./IQuestInfoModel";


interface TimeGateUnlockRequirements 
{
    currentQuest: string,
    nextQuest: string,
    time: number
}

class DExpandedTaskText implements IPostDBLoadMod, IPreSptLoadMod 
{
    private Instance: InstanceManager = new InstanceManager();
    private modName = "ExpandedTaskText";

    private dbPath: string = path.join(path.dirname(__filename), "..", "db");

    private tasks: Record<string, IQuest>;
    private locale: Record<string, Record<string, string>>;
    
    private QuestInfo: IQuestInfoModel[];

    private timeGateUnlocktimes: TimeGateUnlockRequirements[] = [];
    
    public preSptLoad(container: DependencyContainer): void 
    {
        this.Instance.preSptLoad(container, this.modName);
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        const startTime = performance.now();

        this.Instance.postDBLoad(container);

        this.Instance.logger.log("Expanded Task Text is loading please wait...", LogTextColor.GREEN);

        this.QuestInfo = this.loadJsonFile<IQuestInfoModel[]>(path.join(this.dbPath, "QuestInfo.json"));

        this.getAllTasks(this.Instance.database);
        this.updateAllTasksText();

        const endTime = performance.now();
        const startupTime = (endTime - startTime) / 1000;

        this.Instance.logger.log(`Expanded Task Text startup took ${startupTime} seconds...`, LogTextColor.GREEN);
    }

    /**
     * Loads and parses a config file from disk
     * @param fileName File name inside of config folder to load
     */
    public loadJsonFile<T>(filePath: string, readAsText = false): T
    {
        const file = path.join(filePath);
        const string = this.Instance.vfs.readFile(file);
 
        return readAsText 
            ? string as T
            : JSON.parse(string) as T;
    }

    private getAllTasks(database: IDatabaseTables): void 
    {
        this.tasks = database.templates.quests;
        this.locale = database.locales.global;
    }

    private getAllNextQuestsInChain(currentQuestId: string): string | undefined 
    {
        const nextQuests: string[] = [];

        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.keys(this.tasks).forEach(key => 
        {
            if (this.tasks[key].conditions.AvailableForStart === undefined) 
            {
                return undefined;
            }

            const conditionsAOS = this.tasks[key].conditions.AvailableForStart;

            for (const condition in conditionsAOS) 
            {
                if (conditionsAOS[condition]?.conditionType === "Quest" && conditionsAOS[condition]?.target === currentQuestId) 
                {
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

    private getAllTraderLoyalLevelItems(): Record<string, number> 
    {
        const traders: Record<string, ITrader> = this.Instance.database.traders;
        const loyalLevelItems: Record<string, number> = {};

        for (const trader in traders) 
        {
            for (const assortItem in traders[trader]?.assort?.loyal_level_items) 
            {
                loyalLevelItems[assortItem] = traders[trader].assort.loyal_level_items[assortItem];
            }
        }

        return loyalLevelItems;
    }

    private getAndBuildPartsList(taskId: string): string 
    {
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
            let partString = this.locale.en[`${part} Name`];

            for (const trader in traders) 
            {
                for (let i = 0; i < traders[trader]?.assort?.items.length; i++) 
                {
                    if (part === traders[trader].assort.items[i]._tpl && loyalLevelItems[traders[trader].assort.items[i]._id] !== undefined) 
                    {
                        partString += `\n    Sold by (${this.locale.en[`${trader} Nickname`]} LL ${loyalLevelItems[traders[trader].assort.items[i]._id]})`;
                    }
                }
            }

            localizedParts.push(partString);
        }

        return localizedParts.join("\n\n");
    }

    private buildKeyText(objectives: IObjective[], localeId: string): string | undefined
    {
        let keyDesc = "";

        for (const obj of objectives)
        {
            if (obj.requiredKeys === undefined) continue;

            const objDesc = this.locale[localeId][`${obj.id}`];
            let keys = "";

            for (const keysInObj in obj.requiredKeys)
            {
                for (const key in obj.requiredKeys[keysInObj])
                {
                    const localeKey = `${obj.requiredKeys[keysInObj][key]["id"]} Name`
                    const localEntry = this.locale[localeId][localeKey];

                    if (localeKey === undefined || localEntry === undefined) continue;

                    keys += `    ${localEntry}\n`;
                }        
            }

            if (keys.length === 0) continue;

            keyDesc += `${objDesc}\n Requires key(s):\n${keys}`
        }

        return keyDesc;
    }

    private updateAllTasksText() 
    {
        const questInfo = this.QuestInfo;

        for (const info of questInfo)
        {
            for (const localeID in this.locale) 
            { 
                const originalDesc = this.locale[localeID][`${info.id} description`];
                let keyDesc: string = this.buildKeyText(info.objectives, localeID);
                let collector: string;
                let lightKeeper: string;
                let durability: string;
                let requiredParts: string;
                let timeUntilNext: string;
                let leadsTo: string;

                
                if (config.ShowCollectorRequirements && info.kappaRequired) 
                {
                    collector = "This quest is required for Collector \n \n";
                }
                
                
                if (config.ShowLightKeeperRequirements && info.lightkeeperRequired) 
                {
                    lightKeeper = "This quest is required for Lightkeeper \n \n";
                }
                

                const nextQuest: string = this.getAllNextQuestsInChain(info.id);

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

                if (gsEN[info.id]?.RequiredParts !== undefined && config.ShowGunsmithRequiredParts) 
                {
                    durability = "Required Durability: 60 \n";
                    requiredParts = `${this.getAndBuildPartsList(info.id)} \n \n`;
                }

                if (config.ShowTimeUntilNextQuest) 
                {
                    for (const req of this.timeGateUnlocktimes) 
                    {
                        if (req.currentQuest === info.id) 
                        {
                            timeUntilNext = `Hours until ${this.locale.en[`${req.nextQuest} name`]} unlocks after completion: ${req.time} \n \n`;
                        }
                    }
                }

                if (keyDesc === undefined) 
                {
                    keyDesc = "";
                }

                if (collector === undefined) 
                {
                    collector = "";
                }

                if (lightKeeper === undefined) 
                {
                    lightKeeper = "";
                }

                if (requiredParts === undefined) 
                {
                    requiredParts = "";
                }

                if (durability === undefined) 
                {
                    durability = "";
                }

                if (timeUntilNext === undefined) 
                {
                    timeUntilNext = "";
                }

                // biome-ignore lint/style/useTemplate: <>
                this.locale[localeID][`${info.id} description`] = collector + lightKeeper + leadsTo + timeUntilNext +  (keyDesc.length > 0 ? `${keyDesc} \n` : "") + durability + requiredParts + originalDesc;
            }          
        }
    }
}

module.exports = { mod: new DExpandedTaskText() }