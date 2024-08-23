class ATL15_HND_SMR_95
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_SMR95";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        // main
        const itemId = "010421_ATL15_HND_SMR_950"; // unique item id, used in tarkov
        const itemClone = "5ea16acdfadf1d18c87b0784" // base item, make clone from this

        // handbook
        const itemCategory = "5b5f75e486f77447ec5d7712"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 16088; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_SMR95.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "Atlas SMR MK88 9.5in M-LOK Handguard for ATL-15";
        const itemShortName = "ATL SMR 9.5";
        const itemDescription = "Custom, Atlas Superior Modular Rail MK88 9.5in M-LOK Handguard for ATL-15. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 16088;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 3;

        this.addItemTo(itemId);
        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(itemClone, itemId, itemPrefabPath);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
    }

    addItemTo(i_id)
    {
        // add this itemID to Slot# in other itemID
        const itemPropsSlots = [
            "010421_ATL15_UPPER_BLK00", // ATL15 BLK
            "010421_ATL15_UPPER_FDE00", // ATL15 FDE
            "55d355e64bdc2d962f8b4569", // M4A1
            "59bfe68886f7746004266202", // MUR
            "5c07a8770db8340023300450", // NOVESKE
            "5c0e2f26d174af02a9625114", // ADAR
            "5d4405aaa4b9361e6a4e6bd3" // TX15
        ]
        for (let eachItem in itemPropsSlots) // loop through our items and add this itemId to Slots[#] of each
        {
            let item = itemPropsSlots[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Slots[2]._props.filters[0].Filter.push(i_id);
        }
    }

    createItemHandbookEntry(i_id, i_category, i_fprice, i_lname, i_sname, i_desc)
    {
        // add item to handbook
        DatabaseServer.tables.templates.handbook.Items.push(
        {
            "Id": i_id, //use item id
            "ParentId": i_category, // category item will show under
            "Price": i_fprice, // price used on fleamarket
        });
        // add custom item names to all languages
        for (const localeID in DatabaseServer.tables.locales.global)
        {
            DatabaseServer.tables.locales.global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            }
        }
    }

    createItem(i_clone, i_id, i_path)
    {
        let item = JsonUtil.clone(DatabaseServer.tables.templates.items[i_clone]); // https://items.sp-tarkov.com/
        // set clone item to custom itemId
        DatabaseServer.tables.templates.items[i_id] = item;

        // change item properties
        item._id = i_id;
        item._props.Prefab.path = i_path;
    }

    createItemOffer(i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        // add item to trader
        DatabaseServer.tables.traders[i_trader].assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999 // how many trader has of this item
            }
        });
        // add trader cost to item
        DatabaseServer.tables.traders[i_trader].assort.barter_scheme[i_id] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        // add trader loyalty level to item
        DatabaseServer.tables.traders[i_trader].assort.loyal_level_items[i_id] = i_loyalty;

        // add item stack to fleamarket
        DatabaseServer.tables.traders.ragfair.assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999 // how many of this item
            }
        });
        DatabaseServer.tables.traders.ragfair.assort.loyal_level_items[i_id] = 1;
    }
}

module.exports.ATL15_HND_SMR_95 = ATL15_HND_SMR_95;