class ATL15_STK_M7A1
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_STOCK_M7A1";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL15_STK_M7A1000"; // unique item id, used in tarkov
        const itemClone = "591aef7986f774139d495f03" // base item, make clone from this

        // handbook
        const itemCategory = "5b5f757486f774093e6cb507"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 8962; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_M7A1.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "Atlas M7A1 PDW stock for ATL-15";
        const itemShortName = "ATL M7A1";
        const itemDescription = "Custom, Atlas M7A1 PDW stock for ATL-15. Reduces the overall weapon size and recoil buffer. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 8962;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 4;

        this.addItemTo(itemId);
        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(itemClone, itemId, itemPrefabPath);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
    }

    addItemTo(i_id)
    {
        // add this itemID to Slot# in other itemID
        DatabaseServer.tables.templates.items["010421_ATL_WPN_ATL15_BLK"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // ATL-15 BLK
        DatabaseServer.tables.templates.items["010421_ATL_WPN_ATL15_FDE"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // ATL-15 FDE
        DatabaseServer.tables.templates.items["5649b2314bdc2d79388b4576"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // ME for AK 
        DatabaseServer.tables.templates.items["58ac1bf086f77420ed183f9f"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // SIG  PIPE
        DatabaseServer.tables.templates.items["5b099bf25acfc4001637e683"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // SA58 tube 
        DatabaseServer.tables.templates.items["5cde77a9d7f00c000f261009"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // M700 side 
        DatabaseServer.tables.templates.items["5447a9cd4bdc2dbd208b4567"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // M4A1
        DatabaseServer.tables.templates.items["5d43021ca4b9362eab4b5e25"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // TX15
        DatabaseServer.tables.templates.items["5c07c60e0db834002330051f"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // ADAR 
        DatabaseServer.tables.templates.items["5bb2475ed4351e00853264e3"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // 416A5 
        DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[8]._props.filters[0].Filter.push(i_id); // S.A.S.S

        // add this itemID to ConflictingItems in other itemID
        DatabaseServer.tables.templates.items["5c0e2ff6d174af02a1659d4a"]._props.ConflictingItems.push(i_id);
        DatabaseServer.tables.templates.items["5a33e75ac4a2826c6e06d759"]._props.ConflictingItems.push(i_id); // CQR
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
        item._props.ExtraSizeRight = 0;
        item._props.Recoil = -12;
        item._props.Ergonomics = 24;
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

module.exports.ATL15_STK_M7A1 = ATL15_STK_M7A1;
