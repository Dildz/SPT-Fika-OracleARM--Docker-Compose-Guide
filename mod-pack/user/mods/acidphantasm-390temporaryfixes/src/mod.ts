import { DependencyContainer } from "tsyringe";

// SPT imports
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import type { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { IGetBodyResponseData } from "@spt/models/eft/httpResponse/IGetBodyResponseData";

// Custom Classes
import { MyCustomProfileCallbacks } from "./MyCustomProfileCallbacks";
import { MyCustomProfileController } from "./MyCustomProfileController";
import { MyCustomLocationGenerator } from "./MyCustomLocationGenerator";
import { MyCustomQuestController } from "./MyCustomQuestController";
import { MyCustomQuestHelper } from "./MyCustomQuestHelper";
import { IGiftsConfig } from "@spt/models/spt/config/IGiftsConfig";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { ICoreConfig } from "@spt/models/spt/config/ICoreConfig";

class TemporaryFixes implements IPreSptLoadMod, IPostDBLoadMod
{
    private static container: DependencyContainer;

    public preSptLoad(container: DependencyContainer): void
    {
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        container.register<MyCustomProfileCallbacks>("MyCustomProfileCallbacks", MyCustomProfileCallbacks);
        container.register("ProfileCallbacks", { useToken: "MyCustomProfileCallbacks" });

        container.register<MyCustomProfileController>("MyCustomProfileController", MyCustomProfileController);
        container.register("ProfileController", { useToken: "MyCustomProfileController" });

        container.register<MyCustomLocationGenerator>("MyCustomLocationGenerator", MyCustomLocationGenerator);
        container.register("LocationGenerator", { useToken: "MyCustomLocationGenerator" });

        container.register<MyCustomQuestController>("MyCustomQuestController", MyCustomQuestController);
        container.register("QuestController", { useToken: "MyCustomQuestController" });

        container.register<MyCustomQuestHelper>("MyCustomQuestHelper", MyCustomQuestHelper);
        container.register("QuestHelper", { useToken: "MyCustomQuestHelper" });

        
        const profileCallbacks = container.resolve<MyCustomProfileCallbacks>("MyCustomProfileCallbacks");

        staticRouterModService.registerStaticRouter(
            "FixProfileSettingsRouter",
            [
                {
                    url: "/client/profile/settings",
                    action: async (url, info, sessionId, output): Promise<IGetBodyResponseData<boolean>> =>
                    {
                        const newOutput = profileCallbacks.getProfileSettings(url, info, sessionId);
                        return newOutput;
                    }
                }
            ],
            "spt"
        );
    }

    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");

        const giftConfig : IGiftsConfig = configServer.getConfig(ConfigTypes.GIFTS);
        const botConfig : IBotConfig = configServer.getConfig(ConfigTypes.BOT);
        const coreConfig : ICoreConfig = configServer.getConfig(ConfigTypes.CORE);
        const tables: IDatabaseTables = databaseServer.getTables();

        // Fix new figurines to be lootable
        const restrictionsInRaid = tables.globals.config.RestrictionsInRaid;
        const newFigurines = [
            "66572b8d80b1cd4b6a67847f",
            "66572be36a723f7f005a066e",
            "66572cbdad599021091c611a",
            "66572c82ad599021091c6118"
        ]

        for (const restriction in restrictionsInRaid)
        {
            const isIncluded =  newFigurines.some(itemID => restrictionsInRaid[restriction].TemplateId.includes(itemID))
            if (isIncluded)
            {
                restrictionsInRaid[restriction].MaxInLobby = 0;
                restrictionsInRaid[restriction].MaxInRaid = 100;
            }
        }

        // VALENS Gift Code Fix
        const valensGift = giftConfig.gifts.VALENS;

        for (const item in valensGift.items)
        {   
            // Parent Item
            if (valensGift.items[item]._id == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aafa857e5b5b00018480968")
            {
                valensGift.items[item]._id = "a89275c1b18274ef7432a6d4";
            }
            // Attachments
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "64b9e2037fdfb81df81e3c25")
            {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aaf8e43e5b5b00015693246")
            {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5aaf9d53e5b5b00015042a52")
            {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
            if (valensGift.items[item].parentId == "a89275c1b18274ef7432a6d9" && valensGift.items[item]._tpl == "5abcbb20d8ce87001773e258")
            {
                valensGift.items[item].parentId = "a89275c1b18274ef7432a6d4";
            }
        }

        // Fix Unheard Profile Allowing EOD Display
        const unheardProfile = tables.templates.profiles.Unheard;

        if (unheardProfile.bear.character.Info.MemberCategory == 1024)
        {
            unheardProfile.bear.character.Info.MemberCategory = 1026;
        }
        if (unheardProfile.usec.character.Info.MemberCategory == 1024)
        {
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
        }
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
        }
        const pkProperties = Object.assign({}, botConfig.equipment, equipmentFixPeacemaker);
        botConfig.equipment = pkProperties;
        const skierProperties = Object.assign({}, botConfig.equipment, equipmentFixSkier);
        botConfig.equipment = skierProperties;

        // Stash row limit change
        const stashFix = coreConfig.features.chatbotFeatures.commandUseLimits;

        stashFix["StashRows"] = 15;
    }
}

export const mod = new TemporaryFixes();
