class ATL15_UPPER_BLK
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_UPPER_BLK";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        // main
        const itemId = "010421_ATL15_UPPER_BLK00"; // unique item id, used in tarkov
        const itemClone = "5d4405aaa4b9361e6a4e6bd3" // base item, make clone from this

        // handbook
        const itemCategory = "5b5f764186f77447ec5d7714"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 38765; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_REC.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "Atlas .300 BLK Upper for ATL-15 Precision Rifle";
        const itemShortName = "ATL-15 Upper";
        const itemDescription = "Custom, Atlas .300 BLK Upper for ATL-15 Precision Rifle. The ATL-15 upper is optimized for lightweight and durability. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 38765;
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
            "010421_ATL_WPN_ATL15_FDE", // ATL15 BLK
            "010421_ATL_WPN_ATL15_BLK", // ATL15 FDE
            "5447a9cd4bdc2dbd208b4567", // M4A1
            "5d43021ca4b9362eab4b5e25", // TX15
            "5c07c60e0db834002330051f", // ADAR
            "5bb2475ed4351e00853264e3" // 416A5
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
        item._props.Recoil = -3;
        item._props.Ergonomics = 7;
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

module.exports.ATL15_UPPER_BLK = ATL15_UPPER_BLK;
