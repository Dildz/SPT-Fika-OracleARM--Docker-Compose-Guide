"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
class RefSPTFriendlyQuests {
    postDBLoad(container) {
        const databaseService = container.resolve("DatabaseService");
        const logger = container.resolve("WinstonLogger");
        const tables = databaseService.getTables();
        const refTraderID = "6617beeaa9cfa777ca915b7c";
        //Update assort to have quest reward
        tables.traders[refTraderID].questassort["success"]["668caeedbdb70c05d702f1e5"] = "668caeedbdb70c05d702f1b6";
        tables.traders[refTraderID].assort.items.push({
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
        });
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
exports.mod = new RefSPTFriendlyQuests();
//# sourceMappingURL=mod.js.map