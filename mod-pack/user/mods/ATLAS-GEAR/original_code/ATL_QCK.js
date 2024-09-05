class ATL_QCK
{
    constructor()
    {
        this.modname = "ATLAS_GEAR_QCK";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "0010321_GEARSET_QUICK000"; // unique game item id
        const itemBackgroundColor = "blue";
        const itemPrefabPath = "ATL_ARMOR.bundle"; // path === server/mods/thisModName/bundles/...
        const itemCategory = "5b5f701386f774093f2ecf0f"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
        // cab-0af40a737c760c2027c8bc195f3960e5 === cab-0af40a737c760c2027c8bc195a8888t8
        const itemName = "Atlas Quick Armor";
        const itemShortName = "ATL Quick";
        const itemDescription = "Custom, Atlas Lightweight Armor. Provides increased protection against bullets and fragments.";
        const itemTrader = "5ac3b934156ae10c4430e83c"; // trader to sell
        const itemFleaPrice = 245678; // cost on fleamarket *RUB
        const itemTraderPrice = 245678; // Cost of item
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // currency of item
        const itemTraderLV = 3; // Trader Loyalty Level

        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice);
        this.createItem(itemId, itemBackgroundColor, itemPrefabPath, itemName, itemShortName, itemDescription);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
    }

    createItemHandbookEntry(i_id, i_category, i_fprice)
    {
        // add item to handbook
        DatabaseServer.tables.templates.handbook.Items.push(
        {
            "Id": i_id, //use item id
            "ParentId": i_category, // category item will show under
            "Price": i_fprice, // price used on fleamarket
        });
    }

    createItem(i_id, i_color, i_path, i_lname, i_sname, i_desc)
    {
        let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5f5f41476bdad616ad46d631"]); // clone 'BNTI Korund-VM armor'

        // change item properties
        item._id = i_id;
        item._props.BackgroundColor = i_color;
        item._props.Prefab.path = i_path;
        item._props.Durability = 50;
        item._props.MaxDurability = 50;
        item._props.armorClass = 5;
        item._props.speedPenaltyPercent = -10; // Movement Speed
        item._props.mousePenalty = -4; // Turn Speed
        item._props.weaponErgonomicPenalty = -6; // Ergonomics

        // add item back to database
        DatabaseServer.tables.templates.items[i_id] = item;

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

module.exports.ATL_QCK = ATL_QCK;
