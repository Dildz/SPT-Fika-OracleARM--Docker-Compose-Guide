class ATL_SUIT_X99
{
    constructor()
    {
        this.modname = "ATL_SUIT_X99";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        // set up database locations for use later
        const data_base = DatabaseServer.tables;
        const data_global = data_base.locales.global;
        const data_traders = data_base.traders;
        const data_suits = data_base.templates.customization
        // trader to sell (ragman)
        const itemTrader = "5ac3b934156ae10c4430e83c";
        // bundle names
        const itemUpperBundle = "ATL_SUIT_X99_UPPER.bundle";
        const itemHandsBundle = "ATL_SUIT_X99_HANDS.bundle";
        const itemLowerBundle = "ATL_SUIT_X99_LOWER.bundle";
        // itemId's used in player profile
        const itemUpperId = "011021_ATL_SUIT_X99_UPPER";
        const itemHandsId = "011021_ATL_SUIT_X99_HANDS";
        const itemLowerId = "011021_ATL_SUIT_X99_LOWER";
        // suiteId's used for traders to display items
        const itemUpperSuitId = "011021_SUIT_UPPR_ATL_SUIT_X99";
        const itemLowerSuitId = "011021_SUIT_LOWR_ATL_SUIT_X99";
        // name the player sees in menus
        const itemUpperName = "ATLAS X99 Upper";
        const itemLowerName = "ATLAS X99 Lower";
        // run our script for upper and lower (lower is disable so no lower to be created or used)
        this.createItemUpper(data_global, data_suits, data_traders, itemTrader, itemUpperId, itemHandsId, itemUpperBundle, itemHandsBundle, itemUpperSuitId, itemUpperName);
        //this.createItemLower(data_global, data_suits, data_traders, itemTrader, itemLowerId, itemLowerBundle, itemLowerSuitId, itemLowerName);
    }

    createItemUpper(db_global, db_suits, db_traders, i_trader, i_uid, i_hid, i_ubundle, i_hbundle, i_usuitid, i_uname)
    {
        let itemUpper = JsonUtil.clone(db_suits["5f5e401747344c2e4f6c42c5"]);
        let itemHands = JsonUtil.clone(db_suits["5f5f3fa30bc58666c37e782e"]);
        let itemUpperSuit = JsonUtil.clone(db_suits["5f5f45df0bc58666c37e7832"]);

        itemUpper._id = i_uid;
        itemUpper._name = i_uid;
        itemUpper._props.Side = ["Bear", "Usec"];
        itemUpper._props.Prefab.path = i_ubundle;

        db_suits[i_uid] = itemUpper;

        itemHands._id = i_hid;
        itemHands._name = i_hid;
        itemHands._props.Side = ["Bear", "Usec"];
        itemHands._props.Prefab.path = i_hbundle;

        db_suits[i_hid] = itemHands;

        itemUpperSuit._id = i_usuitid;
        itemUpperSuit._name = i_usuitid;
        itemUpperSuit._props.Side = ["Bear", "Usec"];
        itemUpperSuit._props.Body = i_uid;
        itemUpperSuit._props.Hands = i_hid;

        db_suits[i_usuitid] = itemUpperSuit;

        for (const localeID in db_global)
        {
            db_global[localeID].templates[i_usuitid] = {
                "Name": i_uname
            }
        }

        db_traders[i_trader].suits.push(
        {
            "_id": i_uid,
            "tid": i_trader,
            "suiteId": i_usuitid,
            "isActive": true,
            "requirements":
            {
                "loyaltyLevel": 1,
                "profileLevel": 1,
                "standing": 0,
                "skillRequirements": [],
                "questRequirements": [],
                "itemRequirements": [
                {
                    "count": 1800,
                    "_tpl": "5696686a4bdc2da3298b456a"
                }]
            }
        });
    }

    createItemLower(db_global, db_suits, db_traders, i_trader, i_lid, i_lbundle, i_lsuitid, i_lname)
    {
        let itemLower = JsonUtil.clone(db_suits["5f5e40a06760b4138443b341"]);
        let itemLowerSuit = JsonUtil.clone(db_suits["5f5f471bdf4f3100376a815e"]);

        itemLower._id = i_lid;
        itemLower._name = i_lid;
        itemLower._props.Side = ["Bear", "Usec"];
        //itemLower._props.Prefab.path = i_lbundle;

        db_suits[i_lid] = itemLower;

        itemLowerSuit._id = i_lsuitid;
        itemLowerSuit._name = i_lsuitid;
        itemLowerSuit._props.Side = ["Bear", "Usec"];
        itemLowerSuit._props.Feet = i_lid;

        db_suits[i_lsuitid] = itemLowerSuit;

        for (const localeID in db_global)
        {
            db_global[localeID].templates[i_lsuitid] = {
                "Name": i_lname
            }
        }

        db_traders[i_trader].suits.push(
        {
            "_id": i_lid,
            "tid": i_trader,
            "suiteId": i_lsuitid,
            "isActive": true,
            "requirements":
            {
                "loyaltyLevel": 1,
                "profileLevel": 1,
                "standing": 0,
                "skillRequirements": [],
                "questRequirements": [],
                "itemRequirements": [
                {
                    "count": 1800,
                    "_tpl": "5696686a4bdc2da3298b456a"
                }]
            }
        });
    }
}

module.exports.ATL_SUIT_X99 = ATL_SUIT_X99;