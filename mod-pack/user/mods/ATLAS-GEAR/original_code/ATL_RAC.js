class ATL_RAC
{
	constructor()
	{
		this.modname = "ATLAS_GEAR_RAC";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		const itemId = "0010321_GEARSET_RACHST00"; // unique game item id
		const itemBackgroundColor = "blue";
		const itemPrefabPath = "ATL_RAC.bundle"; // path === server/mods/thisModName/bundles/...
		const itemCategory = "5b5f6f3c86f774094242ef87"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
		// CAB-b020028ed907d06d92990287b5168567 === CAB-b020028ed907d06d92990287a8888888
		const itemName = "Atlas FAST RAC Headset";
		const itemShortName = "ATL RAC";
		const itemDescription = "Custom, Atlas FAST RAC Headset. Designed for the Ops-Core FAST helmet. The system of noise reduction and amplification of quiet sounds, as well as a radio headset when connected to the communication device.";
		const itemTrader = "5935c25fb3acc3127c3d8cd9"; // trader to sell
		const itemFleaPrice = 28765; // cost on fleamarket *RUB
		const itemTraderPrice = 269; // Cost of item
		const itemTraderCurrency = "5696686a4bdc2da3298b456a"; // currency of item
		const itemTraderLV = 4; // Trader Loyalty Level

		this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice);
		this.createItem(itemId, itemBackgroundColor, itemPrefabPath, itemName, itemShortName, itemDescription);
		this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
		this.addItemToItemSlot(itemId)
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
		let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5a16b9fffcdbcb0176308b34"]); // clone 'Ops-Core FAST RAC Headset'

		// change item properties
		item._id = i_id;
		item._props.BackgroundColor = i_color;
		item._props.Prefab.path = i_path;
		
		// copy from 'MSA Sordin Supreme PRO-X/L active headphones'
		item._props.Distortion = 0.16;
		item._props.CompressorTreshold = -31;
		item._props.CompressorAttack = 24;
		item._props.CompressorRelease = 164;
		item._props.CompressorGain = 13;
		item._props.CutoffFreq = 120;
		item._props.Resonance = 3;
		item._props.CompressorVolume = -5;
		item._props.AmbientVolume = -5;
		item._props.DryVolume = -60;

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

	addItemToItemSlot(i_id)
	{
		// add item to other item slots
		DatabaseServer.tables.templates.items["5a154d5cfcdbcb001a3b00da"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // FAST MT BLK
		DatabaseServer.tables.templates.items["5ac8d6885acfc400180ae7b0"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // FAST MT TAN
		DatabaseServer.tables.templates.items["5b432d215acfc4771e1c6624"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // LZSH
		DatabaseServer.tables.templates.items["5ea05cf85ad9772e6624305d"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // KEK
	}
}

module.exports.ATL_RAC = ATL_RAC;
