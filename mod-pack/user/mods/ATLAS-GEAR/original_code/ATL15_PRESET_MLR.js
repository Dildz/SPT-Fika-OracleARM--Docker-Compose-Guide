class ATL15_PRESET_MLR
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_PRESET_MLR";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL_WPN_ATL15_BLK"; // item id, used in tarkov

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; // MK
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 4;

        // preset
        const itemPresetID = "010421_ATL15_MLR_PRESET";
        const itemPresetName = "MLR MKII"; // not used for base preset, used as presetName (changeWeaponName = true)
        const itemPresetParent = "010421_ATL15_MLR_PARENT";
        const itemPresetPrice = 289981;

        this.createWeaponPreset(itemPresetID, itemPresetName, itemPresetParent, itemId)
        this.createTraderWeaponPreset(itemPresetID, itemPresetParent, itemId, itemTrader, itemPresetPrice, itemTraderCurrency, itemTraderLV)
    }

    createWeaponPreset(p_id, p_name, p_parent, i_id)
    {
        // add custom itemPreset name to all languages
        for (const localeID in DatabaseServer.tables.locales.global)
        {
            DatabaseServer.tables.locales.global[localeID].preset[p_id] = {
                "Name": p_name
            }
        }

        // add custom weaponPreset to databaseItemPresets
        DatabaseServer.tables.globals.ItemPresets[p_id] = {
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
                "_id": "ATL15_MLR_PRESET_PGRIP00", // uniqueID for this
                "_tpl": "010421_ATL15_PGRIP_MIAD0", // itemID to use e.g "55802f5d4bdc2dac148b458f" == "Magpul MOE AR-15 pistol grip"
                "parentId": p_parent, // parentID for this
                "slotId": "mod_pistol_grip",
            },
            {
                "_id": "ATL15_MLR_PRESET_MAG0000", // uniqueID for this
                "_tpl": "55802d5f4bdc2dac148b458e", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_magazine",
            },
            {
                "_id": "ATL15_MLR_PRESET_UPPER00", // uniqueID for this
                "_tpl": "010421_ATL15_UPPER_BLK00", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_reciever",
            },
            {
                "_id": "ATL15_MLR_PRESET_STOCK00", // uniqueID for this
                "_tpl": "5c793fc42e221600114ca25d", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_stock",
            },
            {
                "_id": "ATL15_MLR_PRESET_STOCK01", // uniqueID for this
                "_tpl": "5b39f8db5acfc40016387a1b", //
                "parentId": "ATL15_MLR_PRESET_STOCK00", // parentID for this
                "slotId": "mod_stock_000",
            },
            {
                "_id": "ATL15_MLR_PRESET_CHARG00", // uniqueID for this
                "_tpl": "010421_ATL15_CRG_REDRPTR", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_charge",
            },
            {
                "_id": "ATL15_MLR_PRESET_BARRL00", // uniqueID for this
                "_tpl": "010421_ATL15_BAR_379_300", //
                "parentId": "ATL15_MLR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_barrel",
            },
            {
                "_id": "ATL15_MLR_PRESET_HANDG00", // uniqueID for this
                "_tpl": "010421_ATL15_HND_SMR_130", //
                "parentId": "ATL15_MLR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_handguard",
            },
            {
                "_id": "ATL15_MLR_PRESET_MUZZL00", // uniqueID for this
                "_tpl": "5d026791d7ad1a04a067ea63", //
                "parentId": "ATL15_MLR_PRESET_BARRL00", // parentID for this
                "slotId": "mod_muzzle",
            },
            {
                "_id": "ATL15_MLR_PRESET_GAS0000", // uniqueID for this
                "_tpl": "5d00ec68d7ad1a04a067e5be", //
                "parentId": "ATL15_MLR_PRESET_BARRL00", // parentID for this
                "slotId": "mod_gas_block",
            },
            {
                "_id": "ATL15_MLR_PRESET_SCOPE00", // uniqueID for this
                "_tpl": "5b2389515acfc4771e1be0c0", //
                "parentId": "ATL15_MLR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_scope",
            },
            {
                "_id": "ATL15_MLR_PRESET_SCOPE01", // uniqueID for this
                "_tpl": "5b3b99475acfc432ff4dcbee", //
                "parentId": "ATL15_MLR_PRESET_SCOPE00", // parentID for this
                "slotId": "mod_scope_000",
            },
            {
                "_id": "ATL15_MLR_PRESET_FGRIP00", // uniqueID for this
                "_tpl": "5b7be4895acfc400170e2dd5", //
                "parentId": "ATL15_MLR_PRESET_HANDG00", // parentID for this
                "slotId": "mod_foregrip",
            },
            {
                "_id": "ATL15_MLR_PRESET_45MNT00", // uniqueID for this
                "_tpl": "5649a2464bdc2d91118b45a8", //
                "parentId": "ATL15_MLR_PRESET_HANDG00", // parentID for this
                "slotId": "mod_scope",
            },
            {
                "_id": "ATL15_MLR_PRESET_45MNT01", // uniqueID for this
                "_tpl": "58d2664f86f7747fec5834f6", //
                "parentId": "ATL15_MLR_PRESET_45MNT00", // parentID for this
                "slotId": "mod_scope",
            },
            {
                "_id": "ATL15_MLR_PRESET_45MNT02", // uniqueID for this
                "_tpl": "58d268fc86f774111273f8c2", //
                "parentId": "ATL15_MLR_PRESET_45MNT01", // parentID for this
                "slotId": "mod_scope",
            },
            {
                "_id": "ATL15_MLR_PRESET_FGRIP01", // uniqueID for this
                "_tpl": "5c1bc5612e221602b5429350", //
                "parentId": "ATL15_MLR_PRESET_FGRIP00", // parentID for this
                "slotId": "mod_foregrip",
            }]
        }
    }

    createTraderWeaponPreset(p_id, p_parent, i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        // get all items from weaponPreset
        let traderWeaponPreset = DatabaseServer.tables.globals.ItemPresets[p_id]._items;

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
        DatabaseServer.tables.traders[i_trader].assort.items.push(...traderWeaponPreset)

        // add traderWeaponPreset cost
        DatabaseServer.tables.traders[i_trader].assort.barter_scheme[p_parent] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]

        // add traderWeaponPreset loyalty requirement
        DatabaseServer.tables.traders[i_trader].assort.loyal_level_items[p_parent] = i_loyalty;
    }
}

module.exports.ATL15_PRESET_MLR = ATL15_PRESET_MLR;
