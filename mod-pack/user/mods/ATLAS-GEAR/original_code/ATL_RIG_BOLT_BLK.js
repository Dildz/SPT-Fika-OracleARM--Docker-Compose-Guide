class ATL_RIG_BOLT_BLK
{
    constructor()
    {
        this.modname = "ATLAS_RIG_BOLT_BLK";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }
    load()
    {
        const data_base = DatabaseServer.tables;
        const data_Items = data_base.templates.items;
        const data_handbook = data_base.templates.handbook.Items;
        const data_global = data_base.locales.global;
        const data_traders = data_base.traders;

        const itemId = "0010321_GEARSET_ALPHBOLT";
        const itemPrefabPath = "ATL_RIG.bundle";
        const itemClone = "5f5f41f56760b4138443b352";
        const itemCategory = "5b5f6f8786f77447ed563642";
        const itemLongName = "Atlas Alphabolt Compact Chest Rig BLK";
        const itemShortName = "ATL Alphabolt";
        const itemDescription = "Custom, Atlas Alphabolt Compact Chest Rig BLK (Black). A combination of integrated pouches and MOLLE straps provide the means of carrying a large set of equipment.";
        const itemFleaPrice = 48876;
        const itemTrader = "5ac3b934156ae10c4430e83c";
        const itemTraderPrice = 48876;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f";
        const itemTraderLV = 3;

        this.createItemHandbookEntry(data_handbook, data_global, itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(data_Items, itemId, itemClone);
        this.createItemOffer(data_traders, itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);

        data_Items[itemId]._props.Prefab.path = itemPrefabPath;
        data_Items[itemId]._props.Weight = 1.2;
        data_Items[itemId]._props.RigLayoutName = "ANA Tactical"; //Alpha Vest Layout 'ANA Tactical'
        data_Items[itemId]._props.Grids.pop(); // remove last 2 grids from vest,else will have bugged slots
        data_Items[itemId]._props.Grids.pop();
        data_Items[itemId]._props.Grids[0]._props.cellsH = 1; // Grids === RigLayoutName
        data_Items[itemId]._props.Grids[0]._props.cellsV = 3;
        data_Items[itemId]._props.Grids[1]._props.cellsH = 1;
        data_Items[itemId]._props.Grids[1]._props.cellsV = 3;
        data_Items[itemId]._props.Grids[2]._props.cellsH = 1;
        data_Items[itemId]._props.Grids[2]._props.cellsV = 3;
        data_Items[itemId]._props.Grids[3]._props.cellsH = 1;
        data_Items[itemId]._props.Grids[3]._props.cellsV = 3;
        data_Items[itemId]._props.Grids[4]._props.cellsH = 1;
        data_Items[itemId]._props.Grids[4]._props.cellsV = 2;
        data_Items[itemId]._props.Grids[5]._props.cellsH = 2;
        data_Items[itemId]._props.Grids[5]._props.cellsV = 2;
        data_Items[itemId]._props.Grids[6]._props.cellsH = 1;
        data_Items[itemId]._props.Grids[6]._props.cellsV = 2;
    }
    createItemHandbookEntry(db_handbook, db_global, i_id, i_category, i_fprice, i_lname, i_sname, i_desc)
    {
        db_handbook.push(
        {
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice,
        });
        for (const localeID in db_global)
        {
            db_global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            };
        }
    }
    createItem(db_items, i_id, i_clone)
    {
        let item = JsonUtil.clone(db_items[i_clone]);
        item._id = i_id;
        db_items[i_id] = item;
    }
    createItemOffer(db_traders, i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        db_traders[i_trader].assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectCount": 999999,
            }
        });
        db_traders[i_trader].assort.barter_scheme[i_id] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        db_traders[i_trader].assort.loyal_level_items[i_id] = i_loyalty;

        db_traders.ragfair.assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectCount": 999999
            }
        });
        db_traders.ragfair.assort.loyal_level_items[i_id] = 1;
    }
}
module.exports.ATL_RIG_BOLT_BLK = ATL_RIG_BOLT_BLK;
