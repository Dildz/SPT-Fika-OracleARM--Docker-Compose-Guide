class ATL15_MUZ_RC2
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_SUPPRESSOR_RC2";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL15_MUZ_RC20000"; // unique item id, used in tarkov
        const itemClone = "5ea17bbc09aa976f2e7a51cd" // base item, make clone from this

        // handbook
        const itemCategory = "5b5f731a86f774093e6cb4f9"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 51788; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_RC2.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "Atlas RC2 .300 BLK suppressor";
        const itemShortName = "ATL RC2";
        const itemDescription = "Custom, Atlas RC2 .300 BLK suppressor, desigend to be installed on compatible Surefire muzzle devices compatible with .300 BLK and NATO 556x45 calibers. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 51788;
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
        const itemPropsSlots = [
            "5c6d710d2e22165df16b81e7", // warcomp
            "5c7fb51d2e2216001219ce11", // SF3P
            "5ea172e498dacb342978818e" // FH556RC
        ]
        for (let eachItem in itemPropsSlots) // loop through our items and add this itemId to Slots[#] of each
        {
            let item = itemPropsSlots[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Slots[0]._props.filters[0].Filter.push(i_id);
        }
        // add this itemID to ConflictingItems in other itemID
        const itemPropsConflictingItems = [
            "5c78f2882e22165df16b832e",
            "5c6d85e02e22165df16b81f4"
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

module.exports.ATL15_MUZ_RC2 = ATL15_MUZ_RC2;
