class ATL_ATL15_FDE
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_FDE";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        // main
        const itemId = "010421_ATL_WPN_ATL15_FDE"; // unique item id, used in tarkov
        const itemClone = "5d43021ca4b9362eab4b5e25" // base item, clone from this

        // handbook
        const itemCategory = "5b5f78fc86f77409407a7f90"; // https://docs.sp-tarkov.com/#resources/other.md -->> Template Category ID
        const itemFleaPrice = 25678; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_FDE/weapon_container.bundle"; // Server/mods/this.modname/bundles/...
        const itemLongName = "Atlas ATL-15 5.56x45 Precision Rifle";
        const itemShortName = "ATL-15";
        const itemDescription = "Custom, Atlas ATL-15 5.56x45 Precision Rifle. Featuring a custom Titanium Nitride bolt carrier, with JP Enhanced Bolt, POF Roller Cam Pin, and enhanced extractor spring and Trigger Tech Adaptable 3.5lb Two Stage Trigger and Radian Talon Ambi Safety Selector Switch. The ATL-15 is optimized for mid/long range shooting. Manufactured by A T L A S";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 25678;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 2;

        // preset
        const itemPresetName = "010421_ATL15_FDE_PRESET";
        const itemPresetID = "010421_ATL15_FDE_PRESETID";
        const itemPresetParent = "010421_ATL15_FDE_PARENT";
        const itemPresetPrice = 189217;

        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItemWeapon(itemClone, itemId, itemPrefabPath);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);

        this.createWeaponPreset(itemPresetID, itemPresetName, itemPresetParent, itemId)
        this.createTraderWeaponPreset(itemPresetID, itemPresetParent, itemId, itemTrader, itemPresetPrice, itemTraderCurrency, itemTraderLV)

        // CAB EDITS
        // TEX  7d033a2c95aec6ef29ea4769d287373f === 97c555509a42d86575b41923218d9ff6
        // CA   7ddb6c5287cae450e38740dbc18f50b5 === 03f1876e3da2f6cc01b6364b6c3ff10b
        // WPN  1f22fe02d16233506bf133a9975c2aab === db85fb3121467459969cbcf97162c85f
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

        // add this to weapon mastering
        DatabaseServer.tables.globals.config.Mastering[0].Templates.push(i_id) // see .../Aki_Data/Server/eft-database/db/globals.json/config/Mastering

        // add custom item naming to all languages
        for (const localeID in DatabaseServer.tables.locales.global)
        {
            DatabaseServer.tables.locales.global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            }
        }
    }

    createItemWeapon(i_clone, i_id, i_path)
    {
        let item = JsonUtil.clone(DatabaseServer.tables.templates.items[i_clone]); // base item, clone from this
        // set clone item to custom itemId
        DatabaseServer.tables.templates.items[i_id] = item;

        // change item properties
        item._id = i_id; // itemId
        item._props.Prefab.path = i_path;
        item._props.weapFireType.push("fullauto") // add full auto to firemode
        item._props.Ergonomics = 55; // ERGO
        item._props.RecoilForceUp = 135; // RECOIL ▲ -- ▼
        item._props.RecoilForceBack = 360; // RECOIL ◄ -- ►
        item._props.bFirerate = 650; // weapon rate of fire
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
            "_changeWeaponName": false,
            "_name": p_name,
            "_encyclopedia": i_id,
            "_parent": p_parent,
            "_items": [
            {
                "_id": p_parent, // this objects uniqueParentID
                "_tpl": i_id, // weapon base
            },
            {
                "_id": "ATL15_FDE_PRESET_PGRIP00", // uniqueID for this
                "_tpl": "5d15cf3bd7ad1a67e71518b2", // itemID to use e.g "55802f5d4bdc2dac148b458f" == "Magpul MOE AR-15 pistol grip"
                "parentId": p_parent, // parentID for this
                "slotId": "mod_pistol_grip",
            },
            {
                "_id": "ATL15_FDE_PRESET_MAG0000", // uniqueID for this
                "_tpl": "5d1340cad7ad1a0b0b249869", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_magazine",
            },
            {
                "_id": "ATL15_FDE_PRESET_UPPER00", // uniqueID for this
                "_tpl": "010421_ATL15_UPPER_FDE00", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_reciever",
            },
            {
                "_id": "ATL15_FDE_PRESET_STOCK00", // uniqueID for this
                "_tpl": "5649be884bdc2d79388b4577", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_stock",
            },
            {
                "_id": "ATL15_FDE_PRESET_CHARG00", // uniqueID for this
                "_tpl": "5b2240bf5acfc40dc528af69", //
                "parentId": p_parent, // parentID for this
                "slotId": "mod_charge",
            },
            {
                "_id": "ATL15_FDE_PRESET_BAR0000", // uniqueID for this
                "_tpl": "55d35ee94bdc2d61338b4568", //
                "parentId": "ATL15_FDE_PRESET_UPPER00", // parentID for this
                "slotId": "mod_barrel",
            },
            {
                "_id": "ATL15_FDE_PRESET_HANDG00", // uniqueID for this
                "_tpl": "5c78f2792e221600106f4683", //
                "parentId": "ATL15_FDE_PRESET_UPPER00", // parentID for this
                "slotId": "mod_handguard",
            },
            {
                "_id": "ATL15_FDE_PRESET_REARS00", // uniqueID for this
                "_tpl": "5c18b9192e2216398b5a8104", //
                "parentId": "ATL15_FDE_PRESET_UPPER00", // parentID for this
                "slotId": "mod_sight_rear",
            },
            {
                "_id": "ATL15_FDE_PRESET_MUZZL00", // uniqueID for this
                "_tpl": "56ea8180d2720bf2698b456a", //
                "parentId": "ATL15_FDE_PRESET_BAR0000", // parentID for this
                "slotId": "mod_muzzle",
            },
            {
                "_id": "ATL15_FDE_PRESET_STOCK01",
                "_tpl": "58d2946386f774496974c37e",
                "parentId": "ATL15_FDE_PRESET_STOCK00",
                "slotId": "mod_stock_000"
            },
            {
                "_id": "ATL15_FDE_PRESET_STOCK02",
                "_tpl": "58d2912286f7744e27117493",
                "parentId": "ATL15_FDE_PRESET_STOCK01",
                "slotId": "mod_stock"
            },
            {
                "_id": "ATL15_FDE_PRESET_GAS0000", // uniqueID for this
                "_tpl": "56ea8d2fd2720b7c698b4570", //
                "parentId": "ATL15_FDE_PRESET_BAR0000", // parentID for this
                "slotId": "mod_gas_block",
            },
            {
                "_id": "ATL15_FDE_PRESET_FGRIP00",
                "_tpl": "5b7be4895acfc400170e2dd5",
                "parentId": "ATL15_FDE_PRESET_HANDG00",
                "slotId": "mod_foregrip"
            },
            {
                "_id": "ATL15_FDE_PRESET_FGRIP01",
                "_tpl": "5fce0cf655375d18a253eff0",
                "parentId": "ATL15_FDE_PRESET_FGRIP00",
                "slotId": "mod_foregrip"
            },
            {
                "_id": "ATL15_FDE_PRESET_MUZZL01",
                "_tpl": "57dbb57e2459774673234890",
                "parentId": "ATL15_FDE_PRESET_MUZZL00",
                "slotId": "mod_muzzle"
            },
            {
                "_id": "ATL15_FDE_PRESET_FRNTS00", // uniqueID for this
                "_tpl": "5c18b90d2e2216152142466b", //
                "parentId": "ATL15_FDE_PRESET_GAS0000", // parentID for this
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

module.exports.ATL_ATL15_FDE = ATL_ATL15_FDE;
