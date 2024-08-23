class ATL_NVG
{
	constructor()
	{
		this.modname = "ATLAS_GEAR_NVG";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		const itemId = "0010321_GEARSET_GPNVG000"; // unique game item id
		const itemBackgroundColor = "blue";
		const itemPrefabPath = "ATL_NVG.bundle"; // path === server/mods/thisModName/bundles/...
		const itemCategory = "5b5f749986f774094242f199"; // Template Category ID --- https://docs.sp-tarkov.com/#resources/other.md
		// CAB-0da733f8b74dc3f32640758de46f830a === CAB-0da733f8b74dc3f32640758da88t888l
		const itemName = "Atlas GPNVG-18 Night Vision";
		const itemShortName = "ATL NVG";
		const itemDescription = "Custom, Atlas GPNVG-18 Night Vision. The cardinal difference of this NVG from the others is the presence of four separate EOP, two for each eye. Two Central EOPs are directed forward, while two more are directed outward from the center. This innovative solution allowed to expand the scope of the review to 97 degrees.";
		const itemTrader = "5935c25fb3acc3127c3d8cd9"; // trader to sell
		const itemFleaPrice = 145008; // cost on fleamarket *RUB
		const itemTraderPrice = 1598; // Cost of item
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
		let item = JsonUtil.clone(DatabaseServer.tables.templates.items["5c0558060db834001b735271"]); // clone 'Ops-Core FAST RAC Headset'

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

	addItemToItemSlot(i_id)
	{
		// add item to other item slots
		DatabaseServer.tables.templates.items["5a154d5cfcdbcb001a3b00da"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // FAST MT BLK
		DatabaseServer.tables.templates.items["5ac8d6885acfc400180ae7b0"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // FAST MT TAN
		DatabaseServer.tables.templates.items["5b432d215acfc4771e1c6624"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // LZSH
		DatabaseServer.tables.templates.items["5ea05cf85ad9772e6624305d"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // KEK
		DatabaseServer.tables.templates.items["5ea058e01dbce517f324b3e2"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // KEK MASK
		DatabaseServer.tables.templates.items["5e4bfc1586f774264f7582d3"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // TC 800
		DatabaseServer.tables.templates.items["5a7c4850e899ef00150be885"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // 6B47
		DatabaseServer.tables.templates.items["5aa7cfc0e5b5b00015693143"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // 6B47 flora
		DatabaseServer.tables.templates.items["5c17a7ed2e2216152142459c"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // AIRFRAME
		DatabaseServer.tables.templates.items["5e00c1ad86f774747333222c"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // EXFIL BLK
		DatabaseServer.tables.templates.items["5e01ef6886f77445f643baa4"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // EXFIL TAN
		DatabaseServer.tables.templates.items["5d6d3716a4b9361bc8618872"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // LSHZ
		DatabaseServer.tables.templates.items["5d5e7d28a4b936645d161203"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // MICH 2001
		DatabaseServer.tables.templates.items["5d5e9c74a4b9364855191c40"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // MICH 2002
		DatabaseServer.tables.templates.items["5ea17ca01412a1425304d1c0"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // BASTION
		DatabaseServer.tables.templates.items["5ea18c84ecf1982c7712d9a2"]._props.Slots[0]._props.filters[0].Filter.push(i_id); // BASTION ARMOR
		DatabaseServer.tables.templates.items["5f60b34a41e30a4ab12a6947"]._props.Slots[1]._props.filters[0].Filter.push(i_id); // Galvion
	}
}

module.exports.ATL_NVG = ATL_NVG;
