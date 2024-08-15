class ATL15_AMMO_TT
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_AMMO_TT";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL15_AMMO_TT0000"; // unique item id, used in tarkov
        const itemClone = "5fbe3ffdf8b6a877a729ea82"; // base item, make clone from this

        // handbook
        const itemCategory = "5b47574386f77428ca22b33b"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 300; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_AMMO_TT.bundle"; // Server/mods/this.modname/bundles/... CAB 2e33dcd51900e1153e9615eca8d9afa3 === f2ba5588e4d8c01fb4f96ad9b2fb64bb
        const itemLongName = ".300 AAC Blackout TT";
        const itemShortName = "TT";
        const itemDescription = "Custom, .300 AAC Blackout Tracer round. Manufactured by A T L A S.";

        // offer
        const itemTrader = "5935c25fb3acc3127c3d8cd9"; // PK
        const itemTraderPrice = 300;
        const itemTraderCurrency = "5696686a4bdc2da3298b456a"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 3;

        this.addItemTo(itemId);
        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(itemClone, itemId, itemPrefabPath);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
    }

    addItemTo(i_id)
    {
        // add this itemID to weaponChambers itemID
        const itemPropsChambers = [
            "010421_ATL_WPN_ATL15_BLK", // ATL-15
            "5fbcc1d9016cce60e8341ab3" // MCX
        ]
        for (let eachItem in itemPropsChambers) // add itemId to each item
        {
            let item = itemPropsChambers[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Chambers[0]._props.filters[0].Filter.push(i_id);
        }

        // add this itemID to magazineCartridges itemID
        const itemPropsCartridges = [
            "55d4887d4bdc2d962f8b4570", // STANAG 30
            "5c05413a0db834001c390617", // HK STEEL 30
            "5c6d450c2e221600114c997d", // HK PM 30
            "5c6d42cb2e2216000e69d7d1", // HK POLY 30
            "59c1383d86f774290a37e0ca", // PMAG 60
            "5aaa5e60e5b5b000140293d6", // PMAG 10
            "5448c1d04bdc2dff2f8b4569", // PMAG 20
            "5aaa5dfee5b5b000140293d3", // PMAG 30
            "5d1340b3d7ad1a0b52682ed7", // PMAG 30 FDE
            "544a378f4bdc2d30388b4567", // PMAG 40
            "5d1340bdd7ad1a0e8d245aab", // PMAG 40 FDE
            "55802d5f4bdc2dac148b458e", // PMAG 30 W
            "5d1340cad7ad1a0b0b249869", // PMAG 30 FDE W
            "5c6592372e221600133e47d7", // STANAG 100
            "544a37c44bdc2d25388b4567", // STANAG 60
            "5c6d46132e221601da357d56", // TROY 30
        ]
        for (let eachItem in itemPropsCartridges) // add itemId to each item
        {
            let item = itemPropsCartridges[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Cartridges[0]._props.filters[0].Filter.push(i_id);
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
        //item._props.Prefab.path = i_path;
        item._props.Damage = 64;
        item._props.PenetrationPower = 29;
        item._props.ArmorDamage = 45;
        item._props.ammoAccr = -4;
        item._props.ammoRec = -6;
        item._props.InitialSpeed = 750;

        // tracer
        item._props.Tracer = true;
        item._props.TracerColor = "tracerGreen";
        item._props.TracerDistance = 0.5;
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

module.exports.ATL15_AMMO_TT = ATL15_AMMO_TT;
