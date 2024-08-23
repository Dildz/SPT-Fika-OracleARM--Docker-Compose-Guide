class ATL_SR25_HAND_FDE
{
    constructor()
    {
        this.modname = "ATLAS_SR25_HAND_FDE";
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

        const itemId = "0088_ATL_SR25_HAND_FDE_8800";
        const itemPrefabPath = "ATL_SR25_HAND_FDE.bundle";
        const itemClone = "5df916dfbb49d91fb446d6b9";
        const itemCategory = "5b5f75e486f77447ec5d7712";
        const itemLongName = "URX-4 handguard for AR-10 and compatible FDE";
        const itemShortName = "URX-4 14.5'' FDE";
        const itemDescription = "Custom, URX-4 is a 14.5 inch long, lightweight M-LOK compatible handguard for AR-10 rifles.";
        const itemFleaPrice = 16506;
        const itemTrader = "5935c25fb3acc3127c3d8cd9";
        const itemTraderPrice = 140;
        const itemTraderCurrency = "5696686a4bdc2da3298b456a";
        const itemTraderLV = 4;

        this.createItemHandbookEntry(data_handbook, data_global, itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(data_Items, itemId, itemClone);
        this.createItemOffer(data_traders, itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
        this.addItemTo(itemId)
        
        data_Items[itemId]._props.Prefab.path = itemPrefabPath;
        //data_Items[itemId]._props.Weight = 8.8;
    }
    addItemTo(i_id)
    {
        const itemPropsSlots = [
            "5df8e4080b92095fd441e594",
            "0088_ATL_SR25_UPPER_FDE_8800"
        ]
        for (let eachItem in itemPropsSlots) // loop through our items and add this itemId to Slots[#] of each
        {
            let item = itemPropsSlots[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Slots[2]._props.filters[0].Filter.push(i_id);
        }
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
module.exports.ATL_SR25_HAND_FDE = ATL_SR25_HAND_FDE;