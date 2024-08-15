class ATL_AFG
{
	constructor()
	{
		this.modname = "ATLAS_GEAR_AFG";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		const itemId = "0010321_GEARSET_ANTIFRAG"; // unique game item id
		const itemBackgroundColor = "blue"; // bg color in menus
		const itemPrefabPath = "ATL_VISOR.bundle"; // path === server/mods/thisModName/bundles/...
		const itemCategory = "5b47574386f77428ca22b331"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
		// CAB-58a829ebd1a1ad9c68c2d351bbcbaf8a === CAB-58a829ebd1a1ad9c68c2d351xatlas8a visor
		// CAB-c4c38afe2fbfa3b17bc6e16d2bc20724 === CAB-c4c38afe2fbfa3b17bc6e16d2at88888 visor glass
		const itemName = "Atlas Anti-fragmentation Glasses";
		const itemShortName = "ATL AFG";
		const itemDescription = "Custom, Atlas Anti-fragmentation Glasses. Modified from Russian military gear.";
		const itemTrader = "5ac3b934156ae10c4430e83c"; // trader to sell
		const itemFleaPrice = 2876; // cost on fleamarket *RUB
		const itemTraderPrice = 2987; // Cost of item
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
		let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5b432be65acfc433000ed01f"]); // clone '6B34 Anti-fragmentation glasses'

		// change item properties
		item._id = i_id;
		item._props.BackgroundColor = i_color;
		item._props.Prefab.path = i_path;

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

module.exports.ATL_AFG = ATL_AFG;
