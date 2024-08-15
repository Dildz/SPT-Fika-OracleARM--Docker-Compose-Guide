import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPostAkiLoadMod } from "@spt/models/external/IPostAkiLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IInventoryConfig } from "@spt/models/spt/config/IInventoryConfig";

import * as crateContents from "./database/crateContents.json";
import * as itemsToAdd from "./database/itemsToAdd.json";

class ModLoader implements IPostAkiLoadMod, IPostDBLoadMod {
    private container: DependencyContainer;

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const dbServer = container.resolve<DatabaseServer>("DatabaseServer");
        const dbTables = dbServer.getTables();
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const inventoryConfig: IInventoryConfig = configServer.getConfig<IInventoryConfig>(ConfigTypes.INVENTORY);

        const ref = dbTables.traders["6617beeaa9cfa777ca915b7c"];

        for (let item of itemsToAdd.items) {
            const BoxItem = {
                "_id": item._id,
                "_tpl": item._tpl,
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "StackObjectsCount": 9999999,
                    "BuyRestrictionMax": item.buyRestrictionMax,
                    "BuyRestrictionCurrent": 0
                }
            };

            ref.assort.items.push(BoxItem);

            ref.assort.barter_scheme[`${item._id}`] = [
                [
                    {
                        "count": item.price,
                        "_tpl": "5d235b4d86f7742e017bc88a"
                    }
                ]
            ];

            ref.assort.loyal_level_items[item._id] = item.loyaltyLevel;

            if(item.openID)
            {
                inventoryConfig.randomLootContainers[item.openID] = crateContents[item.openID];
            }
        }

        logger.logWithColor("Boxes Added to Ref", LogTextColor.GREEN);
    }
}

module.exports = { mod: new ModLoader() };
