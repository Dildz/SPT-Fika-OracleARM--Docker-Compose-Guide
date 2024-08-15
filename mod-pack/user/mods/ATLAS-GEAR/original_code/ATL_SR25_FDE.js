class ATL_SR25_FDE
{
    constructor()
    {
        this.modname = "ATLAS_SR25_FDE";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }
    load()
    {
        const data_base = DatabaseServer.tables;
        const data_Items = data_base.templates.items;
        const data_handbook = data_base.templates.handbook.Items;
        const data_locales = data_base.locales.global;
        const data_traders = data_base.traders;
        const data_globals = data_base.globals

        const itemId = "0088_ATL_SR25_FDE_8800";
        const itemPrefabPath = "SR25/weapon_container.bundle";
        const itemClone = "5df8ce05b11454561e39243b";
        const itemCategory = "5b5f791486f774093f2ed3be";
        const itemLongName = "Knight's Armament Company SR-25 7.62x51 FDE";
        const itemShortName = "SR-25";
        const itemDescription = "Custom, The SR-25 Precision Rifle is the latest evolution of the precision 7.62mm NATO semi-automatic rifle. An ambidextrous bolt release, selector, and magazine release offers the left-handed user the ergonomic advantages inherent to AR15 based controls, as well as giving right-handed users alternate methods of manipulation to increase efficiency of movement. The Drop-In 2-Stage Trigger serves as an aid to long range precision marksmanship. The E2 bolt and gas system provides superior reliability in function whether suppressed or unsuppressed.";
        const itemFleaPrice = 26528;
        const itemTrader = "5935c25fb3acc3127c3d8cd9";
        const itemTraderPrice = 225;
        const itemTraderCurrency = "5696686a4bdc2da3298b456a";
        const itemTraderLV = 4;

        // WPN 055d0f12dcb38b1f3928ac5d482945bc === c988870f3e881b9236562a46bd3cb254
        // CAA ac30ca0aff06b6356f2c811f0fb05722 === 8107c053735c03821aa42bebd1a2953a
        // TEX f1404b8b4acc1ed36606c31045d65385 === ce13d81877354be65901b67d2f413c2d

        this.createItemHandbookEntry(data_handbook, data_locales, itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription, data_globals);
        this.createItem(data_Items, itemId, itemClone);
        this.createItemOffer(data_traders, itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);

        data_Items[itemId]._props.Prefab.path = itemPrefabPath;
        data_Items[itemId]._props.weapFireType.push("fullauto");
    }
    createItemHandbookEntry(db_handbook, db_locales, i_id, i_category, i_fprice, i_lname, i_sname, i_desc, db_globals)
    {
        db_handbook.push(
        {
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice,
        });
        db_globals.config.Mastering[43].Templates.push(i_id)
        for (const localeID in db_locales)
        {
            db_locales[localeID].templates[i_id] = {
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
module.exports.ATL_SR25_FDE = ATL_SR25_FDE;