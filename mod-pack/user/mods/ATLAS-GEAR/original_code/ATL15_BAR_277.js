class ATL15_BAR_277
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_BARREL_277";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL15_BAR_277_300"; // unique item id, used in tarkov
        const itemClone = "55d35ee94bdc2d61338b4568" // base item, make clone from this 

        // handbook
        const itemCategory = "5b5f75c686f774094242f19f"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 32788; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_BAR_277.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "277mm Titanium Nitride Barrel for ATL-15 .300 BLK"; // 277mm = ~11"
        const itemShortName = "277mm ATL-15 .300 BLK";
        const itemDescription = "Custom, Atlas 277mm Titanium Nitride Barrel for ATL-15 .300 BLK. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; // MK
        const itemTraderPrice = 32788;
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
            "010421_ATL15_UPPER_BLK00", // ATL15 UPPER BLK
            "010421_ATL15_UPPER_FDE00", // ATL15 UPPER FDE
            "55d355e64bdc2d962f8b4569", // M4A1 UPPER
            "59bfe68886f7746004266202", // VLTOR MUR
            "5c07a8770db8340023300450", // NOVESKE
            "5c0e2f26d174af02a9625114", // ADAR
            "5d4405aaa4b9361e6a4e6bd3" // TX-15 UPPER
        ]
        for (let eachItem in itemPropsSlots) // loop through our items and add this itemId to Slots[#] of each
        {
            let item = itemPropsSlots[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Slots[1]._props.filters[0].Filter.push(i_id);
        }

        // add this itemID to ConflictingItems in other itemID
        const itemPropsConflictingItems = [
            "010421_ATL15_HND_SMR_130", // ATL SMR 13"
            "5c0e2f5cd174af02a012cfc9", // ADAR HG
            "595cfa8b86f77427437e845b", // LVOA C 
            "5c78f2492e221600114c9f04", // SAI 14 
            "5c78f26f2e221601da3581d1", // MOE SL
            "5c9a25172e2216000f20314e", // DD 12"
            "5ea16ada09aa976f2e7a51be", // SMR 13" 
            "5d122e7bd7ad1a07102d6d7f", // URX 10" 
            "5d4405f0a4b9361e6a4e6bd9", // ION LITE  
            "5c78f2612e221600114c9f0d", // SAI 10"
            "5d00ef6dd7ad1a0940739b16",
            "5d00ede1d7ad1a0940739a76",
            "5fc235db2770a0045c59c683",
            "5df916dfbb49d91fb446d6b9"
        ]
        for (let eachItem in itemPropsConflictingItems)
        {
            let item = itemPropsConflictingItems[eachItem];
            DatabaseServer.tables.templates.items[item]._props.ConflictingItems.push(i_id);
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
        item._props.Weight = 0.408;
        item._props.Prefab.path = i_path;
        item._props.Recoil = -3;
        item._props.Ergonomics = -3;
        item._props.Velocity = -4.2;
        item._props.CenterOfImpact = 0.047; // 1MOA = 0.036

        // add conflicting parts 556 lower for this barrel
        item._props.ConflictingItems.push(
            "010421_ATL_WPN_ATL15_FDE",
            "5447a9cd4bdc2dbd208b4567",
            "5d43021ca4b9362eab4b5e25",
            "5c07c60e0db834002330051f",
            "5c78f2882e22165df16b832e")

        // add other items to this item
        item._props.Slots[0]._props.filters[0].Filter = [
            "5b7d693d5acfc43bca706a3d",
            "5a34fd2bc4a282329a73b4c5",
            "5d1f819086f7744b355c219b",
            "5dcbe965e4ed22586443a79d",
            "5d026791d7ad1a04a067ea63",
            "5dfa3cd1b33c0951220c079b",
            "5cdd7685d7f00c000f260ed2",
            "5c878e9d2e2216000f201903",
            "5d02677ad7ad1a04a15c0f95",
            "5bbdb8bdd4351e4502011460",
            "5cdd7693d7f00c0010373aa5",
            "5d443f8fa4b93678dd4a01aa",
            "5addbb825acfc408fb139400",
            "5addbb945acfc4001a5fc44e",
            "5addbba15acfc400185c2854",
            "5addbbb25acfc40015621bd9",
            "5addbb6e5acfc408fb1393fd",
            "5c7954d52e221600106f4cc7",
            "5fbc22ccf24b94483f726483",
            "59bffc1f86f77435b128b872",
            "5cf78496d7f00c065703d6ca",
            "5fbe7618d6fa9c00c571bb6c",
            "5c7fb51d2e2216001219ce11" // SF3P
        ]
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

module.exports.ATL15_BAR_277 = ATL15_BAR_277;
