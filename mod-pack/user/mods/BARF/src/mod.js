"use strict";
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
const LogTextColor_1 = require("/snapshot/project/obj/models/spt/logging/LogTextColor");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const crateContents = __importStar(require("./database/crateContents.json"));
const itemsToAdd = __importStar(require("./database/itemsToAdd.json"));
class ModLoader {
    container;
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const dbServer = container.resolve("DatabaseServer");
        const dbTables = dbServer.getTables();
        const configServer = container.resolve("ConfigServer");
        const inventoryConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.INVENTORY);
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
            if (item.openID) {
                inventoryConfig.randomLootContainers[item.openID] = crateContents[item.openID];
            }
        }
        logger.logWithColor("Boxes Added to Ref", LogTextColor_1.LogTextColor.GREEN);
    }
}
module.exports = { mod: new ModLoader() };
//# sourceMappingURL=mod.js.map