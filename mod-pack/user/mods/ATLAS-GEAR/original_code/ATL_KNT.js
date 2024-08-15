class ATL_KNT
{
	constructor()
	{
		this.modname = "ATLAS_GEAR_KNT";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		const itemId = "0010321_GEARSET_KNIGHT00"; // unique game item id
		const itemBackgroundColor = "blue";
		const itemPrefabPath = "ATL_KNIGHT.bundle"; // path === server/mods/thisModName/bundles/...
		const itemCategory = "5b5f6f6c86f774093f2ecf0b"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
		// CAB d7a50bd427b0e8b363968054d76a99fb === d7a50bd427b0e8b363968054d76a88at
		const itemName = "Atlas Knight Backpack";
		const itemShortName = "ATL Knight";
		const itemDescription = "Custom, Atlas Low-Profile Backpack. which allows you to very effectively carry items and equipment.";
		const itemTrader = "5ac3b934156ae10c4430e83c"; // trader to sell
		const itemFleaPrice = 25891; // cost on fleamarket *RUB
		const itemTraderPrice = 25891; // Cost of item
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
		let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5e4abc6786f77406812bd572"]); // clone 'LBT-2670 Slim Field Med Pack'

		// change item properties
		item._id = i_id;
		item._props.BackgroundColor = i_color;
		item._props.Prefab.path = i_path;
		item._props.Weight = 0.9;
		item._props.Grids[0]._props.filters = [];
		item._props.Grids[0]._props.cellsH = 4;
		item._props.Grids[0]._props.cellsV = 6;

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

module.exports.ATL_KNT = ATL_KNT;
