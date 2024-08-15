class G17_PRESET_FADE
{
    constructor()
    {
        this.modname = "ATLAS_G17_PRESET_FADE";
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
        const data_ItemPreset = data_base.globals.ItemPresets;

        const itemId = "5a7ae0c351dfba0017554310";
        const itemTrader = "5a7c2eca46aef81a7ca2145d";
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 3;
        const itemPresetID = "010521_G17_FADE_PRESET";
        const itemPresetName = "FADE"; // not used for base preset, used as presetName (changeWeaponName = true)
        const itemPresetParent = "010521_G17_FADE_PARENT";
        const itemPresetPrice = 46739;

        this.createWeaponPreset(data_ItemPreset, data_global, itemPresetID, itemPresetName, itemPresetParent, itemId)
        this.createTraderWeaponPreset(data_ItemPreset, data_traders, itemPresetID, itemPresetParent, itemId, itemTrader, itemPresetPrice, itemTraderCurrency, itemTraderLV)
    }
    createWeaponPreset(db_preset, db_global, p_id, p_name, p_parent, i_id)
    {
        for (const localeID in db_global)
        {
            db_global[localeID].preset[p_id] = {
                "Name": p_name
            }
        }
        // add custom weaponPreset to databaseItemPresets
        db_preset[p_id] = {
            "_id": p_id,
            "_type": "Preset",
            "_changeWeaponName": true,
            "_name": p_name,
            "_parent": p_parent,
            "_items": [
            {
                "_id": p_parent, // this objects uniqueParentID
                "_tpl": i_id, // weapon base
            },
            {
                "_id": "G17_FADE_PRESET_BARRL00", // uniqueID for this 
                "_tpl": "5a6b5f868dc32e000a311389", // itemID to use e.g "55802f5d4bdc2dac148b458f" == "Magpul MOE AR-15 pistol grip"
                "parentId": p_parent, // parentID for this
                "slotId": "mod_barrel",
            },
            {
                "_id": "G17_FADE_PRESET_PGRIP00", // uniqueID for this
                "_tpl": "5a7b4960e899ef197b331a2d", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_pistol_grip",
            },
            {
                "_id": "G17_FADE_PRESET_UPPER00", // uniqueID for this
                "_tpl": "010521_REC_G17_FADE_000", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_reciever",
            },
            {
                "_id": "G17_FADE_PRESET_MAG000", // uniqueID for this
                "_tpl": "5a718da68dc32e000d46d264", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_magazine",
            },
            {
                "_id": "G17_FADE_PRESET_RSIGHT0", // uniqueID for this
                "_tpl": "5a7d912f159bd400165484f3", //
                "parentId": "G17_FADE_PRESET_UPPER00", // parentID for this
                "slotId": "mod_sight_rear",
            },
            {
                "_id": "G17_FADE_PRESET_FSIGHT01", // uniqueID for this
                "_tpl": "5a7d9104159bd400134c8c21", //
                "parentId": "G17_FADE_PRESET_UPPER00", // parentID for this
                "slotId": "mod_sight_front",
            }]
        }
    }
    createTraderWeaponPreset(db_preset, db_trader, p_id, p_parent, i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        // get all items from weaponPreset
        let traderWeaponPreset = db_preset[p_id]._items;
        // modifty weaponPreset for trader
        traderWeaponPreset[0] = (
        {
            "_id": p_parent,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });
        // add ...each item traderWeaponPreset to trader - *because all items in list are parent/child this will cause trader to construct traderWeaponPreset
        db_trader[i_trader].assort.items.push(...traderWeaponPreset)
        // add traderWeaponPreset cost
        db_trader[i_trader].assort.barter_scheme[p_parent] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        // add traderWeaponPreset loyalty requirement
        db_trader[i_trader].assort.loyal_level_items[p_parent] = i_loyalty;
    }
}
module.exports.G17_PRESET_FADE = G17_PRESET_FADE;
