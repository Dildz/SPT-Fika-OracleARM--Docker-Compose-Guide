class ATL_SR25_PRESET_DEFAULT
{
    constructor()
    {
        this.modname = "ATL_SR25_PRESET_DEFAULT";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }
    load()
    {
        const data_base = DatabaseServer.tables;
        const data_Items = data_base.templates.items;
        const data_handbook = data_base.templates.handbook.Items;
        const data_locales = data_base.locales.global;
        const data_traders = data_base.traders;
        const data_itemPresets = data_base.globals.ItemPresets

        const itemId = "0088_ATL_SR25_FDE_8800";
        const itemTrader = "5935c25fb3acc3127c3d8cd9";
        const itemTraderCurrency = "5696686a4bdc2da3298b456a";
        const itemTraderLV = 4;
        const itemPresetPrice = 1100;
        const itemPresetID = "ATL_SR25_PRESET_DEFAULT_ID";
        const itemPresetParent = "ATL_SR25_PRESET_DEFAULT_PARENT";
        const itemUsePresetName = false; // false = Weapon Stock preset || true = use itemPresetName
        const itemPresetName = "FDE";

        this.createWeaponPreset(itemPresetID, itemPresetName, itemPresetParent, itemId, data_locales, data_itemPresets, itemUsePresetName)
        this.createTraderWeaponPreset(itemPresetID, itemPresetParent, itemId, itemTrader, itemPresetPrice, itemTraderCurrency, itemTraderLV, data_itemPresets, data_traders)
    }
    createWeaponPreset(p_id, p_name, p_parent, i_id, db_locales, db_presets, i_usename)
    {
        for (const localeID in db_locales)
        {
            db_locales[localeID].preset[p_id] = {
                "Name": p_name
            }
        }
        db_presets[p_id] = {
            "_id": p_id,
            "_type": "Preset",
            "_changeWeaponName": i_usename,
            "_name": p_name,
            "_encyclopedia": i_id,
            "_parent": p_parent,
            "_items": [
            {
                "_id": p_parent,
                "_tpl": i_id
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_PGRIP00",
                "_tpl": "55802f5d4bdc2dac148b458f",
                "parentId": p_parent,
                "slotId": "mod_pistol_grip"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_MAG00",
                "_tpl": "5a3501acc4a282000d72293a",
                "parentId": p_parent,
                "slotId": "mod_magazine"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_STOCK00",
                "_tpl": "5c793fb92e221644f31bfb64",
                "parentId": p_parent,
                "slotId": "mod_stock"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_UPPER00",
                "_tpl": "0088_ATL_SR25_UPPER_FDE_8800",
                "parentId": p_parent,
                "slotId": "mod_reciever"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_CHARGE00",
                "_tpl": "5df8e085bb49d91fb446d6a8",
                "parentId": p_parent,
                "slotId": "mod_charge"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_STOCK01",
                "_tpl": "58d2946386f774496974c37e",
                "parentId": "ATL_SR25_PRESET_DEFAULT_STOCK00",
                "slotId": "mod_stock_000"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_BARRL00",
                "_tpl": "5df917564a9f347bc92edca3",
                "parentId": "ATL_SR25_PRESET_DEFAULT_UPPER00",
                "slotId": "mod_barrel"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_HAND00",
                "_tpl": "0088_ATL_SR25_HAND_FDE_8800",
                "parentId": "ATL_SR25_PRESET_DEFAULT_UPPER00",
                "slotId": "mod_handguard"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_OPTRS00",
                "_tpl": "5c18b9192e2216398b5a8104",
                "parentId": "ATL_SR25_PRESET_DEFAULT_UPPER00",
                "slotId": "mod_sight_rear"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_STOCK02",
                "_tpl": "58d2912286f7744e27117493",
                "parentId": "ATL_SR25_PRESET_DEFAULT_STOCK01",
                "slotId": "mod_stock"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_MUZZL00",
                "_tpl": "5dfa3cd1b33c0951220c079b",
                "parentId": "ATL_SR25_PRESET_DEFAULT_BARRL00",
                "slotId": "mod_muzzle"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_GASBLK00",
                "_tpl": "5dfa3d45dfc58d14537c20b0",
                "parentId": "ATL_SR25_PRESET_DEFAULT_BARRL00",
                "slotId": "mod_gas_block"
            },
            {
                "_id": "ATL_SR25_PRESET_DEFAULT_OPTFS00",
                "_tpl": "5c18b90d2e2216152142466b",
                "parentId": "ATL_SR25_PRESET_DEFAULT_HAND00",
                "slotId": "mod_sight_front"
            }]
        }
    }

    createTraderWeaponPreset(p_id, p_parent, i_id, i_trader, i_price, i_currency, i_loyalty, db_presets, db_traders)
    {
        let traderWeaponPreset = db_presets[p_id]._items;
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
        db_traders[i_trader].assort.items.push(...traderWeaponPreset)
        db_traders[i_trader].assort.barter_scheme[p_parent] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        db_traders[i_trader].assort.loyal_level_items[p_parent] = i_loyalty;
    }
}

module.exports.ATL_SR25_PRESET_DEFAULT = ATL_SR25_PRESET_DEFAULT;