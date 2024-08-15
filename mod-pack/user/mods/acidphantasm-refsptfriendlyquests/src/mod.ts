import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseService } from "@spt/services/DatabaseService";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class RefSPTFriendlyQuests implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const tables: IDatabaseTables = databaseService.getTables();
        const refTraderID = "6617beeaa9cfa777ca915b7c";

        //Update assort to have quest reward
        tables.traders[refTraderID].questassort["success"]["668caeedbdb70c05d702f1e5"]= "668caeedbdb70c05d702f1b6" ;
        tables.traders[refTraderID].assort.items.push(
            {
                "_id": "668caeedbdb70c05d702f1e5",
                "_tpl": "664a5428d5e33a713b622379",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 500,
                    "BuyRestrictionMax": 1,
                    "BuyRestrictionCurrent": 0
                }
            }
        );
        tables.traders[refTraderID].assort.barter_scheme["668caeedbdb70c05d702f1e5"] = 
        [
            [
                {
                    "count": 3,
                    "_tpl": "6656560053eaaa7a23349c86"
                }
            ]
        ];
        tables.traders[refTraderID].assort.loyal_level_items["668caeedbdb70c05d702f1e5"] = 1;
    }
}

export const mod = new RefSPTFriendlyQuests();
