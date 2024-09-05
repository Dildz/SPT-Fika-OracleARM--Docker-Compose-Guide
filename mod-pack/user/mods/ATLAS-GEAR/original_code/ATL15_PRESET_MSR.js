class ATL15_PRESET_MSR
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_PRESET_MSR";
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
        const itemPresetID = "010421_ATL15_MSR_PRESET";
        const itemPresetName = "MSR MKII"; // not used for base preset, used as presetName (changeWeaponName = true)
        const itemPresetParent = "010421_ATL15_MSR_PARENT";
        const itemPresetPrice = 261223;

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
                "_id": "ATL15_MSR_PRESET_PGRIP00", // uniqueID for this
                "_tpl": "55802f5d4bdc2dac148b458f", // itemID to use e.g "55802f5d4bdc2dac148b458f" == "Magpul MOE AR-15 pistol grip"
                "parentId": p_parent, // parentID for this
                "slotId": "mod_pistol_grip",
            },
            {
                "_id": "ATL15_MSR_PRESET_MAG0000", // uniqueID for this
                "_tpl": "55802d5f4bdc2dac148b458e", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_magazine",
            },
            {
                "_id": "ATL15_MSR_PRESET_UPPER00", // uniqueID for this
                "_tpl": "010421_ATL15_UPPER_BLK00", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_reciever",
            },
            {
                "_id": "ATL15_MSR_PRESET_STOCK00", // uniqueID for this
                "_tpl": "5d120a10d7ad1a4e1026ba85", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_stock",
            },
            {
                "_id": "ATL15_MSR_PRESET_CHARG00", // uniqueID for this
                "_tpl": "010421_ATL15_CRG_REDRPTR", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_charge",
            },
            {
                "_id": "ATL15_MSR_PRESET_BARRL00", // uniqueID for this
                "_tpl": "010421_ATL15_BAR_277_300", //
                "parentId": "ATL15_MSR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_barrel",
            },
            {
                "_id": "ATL15_MSR_PRESET_HANDG00", // uniqueID for this
                "_tpl": "010421_ATL15_HND_SMR_950", //
                "parentId": "ATL15_MSR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_handguard",
            },
            {
                "_id": "ATL15_MSR_PRESET_REARS00", // uniqueID for this
                "_tpl": "5fb6564947ce63734e3fa1da", //
                "parentId": "ATL15_MSR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_sight_rear",
            },
            {
                "_id": "ATL15_MSR_PRESET_STOCK01", // uniqueID for this
                "_tpl": "5d120a28d7ad1a1c8962e295", //
                "parentId": "ATL15_MSR_PRESET_STOCK00", // parentID for this
                "slotId": "mod_stock",
            },
            {
                "_id": "ATL15_MSR_PRESET_MUZZL00", // uniqueID for this
                "_tpl": "5c7fb51d2e2216001219ce11", //
                "parentId": "ATL15_MSR_PRESET_BARRL00", // parentID for this
                "slotId": "mod_muzzle",
            },
            {
                "_id": "ATL15_MSR_PRESET_GAS0000", // uniqueID for this
                "_tpl": "5d00ec68d7ad1a04a067e5be", //
                "parentId": "ATL15_MSR_PRESET_BARRL00", // parentID for this
                "slotId": "mod_gas_block",
            },
            {
                "_id": "ATL15_MSR_PRESET_SCOPE00", // uniqueID for this
                "_tpl": "59f9d81586f7744c7506ee62", //
                "parentId": "ATL15_MSR_PRESET_UPPER00", // parentID for this
                "slotId": "mod_scope",
            },
            {
                "_id": "ATL15_MSR_PRESET_FGRIP00", // uniqueID for this
                "_tpl": "5b7be4895acfc400170e2dd5", //
                "parentId": "ATL15_MSR_PRESET_HANDG00", // parentID for this
                "slotId": "mod_foregrip",
            },
            {
                "_id": "ATL15_MSR_PRESET_FGRIP01", // uniqueID for this
                "_tpl": "59fc48e086f77463b1118392", //
                "parentId": "ATL15_MSR_PRESET_FGRIP00", // parentID for this
                "slotId": "mod_foregrip",
            },
            {
                "_id": "ATL15_MSR_PRESET_MUZZL01", // uniqueID for this
                "_tpl": "010421_ATL15_MUZ_RC20000", //
                "parentId": "ATL15_MSR_PRESET_MUZZL00", // parentID for this
                "slotId": "mod_muzzle",
            },
            {
                "_id": "ATL15_MSR_PRESET_TACTL00", // uniqueID for this
                "_tpl": "010421_ATL15_TAC_PEQ1500", //
                "parentId": "ATL15_MSR_PRESET_HANDG00", // parentID for this
                "slotId": "mod_tactical_000",
            },
            {
                "_id": "ATL15_MSR_PRESET_FRNTS00", // uniqueID for this
                "_tpl": "5fb6567747ce63734e3fa1dc", //
                "parentId": "ATL15_MSR_PRESET_HANDG00", // parentID for this
                "slotId": "mod_sight_front",
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

module.exports.ATL15_PRESET_MSR = ATL15_PRESET_MSR;
