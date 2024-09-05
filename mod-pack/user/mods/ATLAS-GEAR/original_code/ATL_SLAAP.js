class ATL_SLAAP
{
	constructor()
	{
		this.modname = "ATLAS_GEAR_SLAAP";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		const itemId = "0010321_GEARSET_SLAAPARM"; // unique game item id
		const itemBackgroundColor = "blue"; // bg color in menus
		const itemPrefabPath = "ATL_SLAAP.bundle"; // path === server/mods/thisModName/bundles/...
		const itemCategory = "5b5f704686f77447ec5d76d7"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
		// CAB-21abf5fb967ef4bab22f721b64a565a1 === CAB-21abf5fb967ef4bab22f721a88t888l8
		const itemName = "Atlas SLAAP Armor Plate";
		const itemShortName = "ATL SLAAP";
		const itemDescription = "Custom, Atlas Armor for the Ops-Core FAST helmet, made of a special polyethylene plate.";
		const itemTrader = "5935c25fb3acc3127c3d8cd9"; // trader to sell
		const itemFleaPrice = 89300; // cost on fleamarket *RUB
		const itemTraderPrice = 760; // Cost of item
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
		let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5c0e66e2d174af02a96252f4"]); // clone 'SLAAP armor Plate (Tan)'

		// change item properties
		item._id = i_id;
		item._props.BackgroundColor = i_color;
		item._props.Prefab.path = i_path;
		item._props.armorClass = 4;
		item._props.mousePenalty = -4;
		item._props.weaponErgonomicPenalty = -9;

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
		DatabaseServer.tables.templates.items["5a154d5cfcdbcb001a3b00da"]._props.Slots[4]._props.filters[0].Filter.push(i_id); // FAST MT BLK
		DatabaseServer.tables.templates.items["5ac8d6885acfc400180ae7b0"]._props.Slots[4]._props.filters[0].Filter.push(i_id); // FAST MT TAN
		DatabaseServer.tables.templates.items["5ea05cf85ad9772e6624305d"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // KEK
		DatabaseServer.tables.templates.items["5d5e7d28a4b936645d161203"]._props.Slots[2]._props.filters[0].Filter.push(i_id); // 2001
		DatabaseServer.tables.templates.items["5d5e9c74a4b9364855191c40"]._props.Slots[2]._props.filters[0].Filter.push(i_id); // 2002

	}
}

module.exports.ATL_SLAAP = ATL_SLAAP;
