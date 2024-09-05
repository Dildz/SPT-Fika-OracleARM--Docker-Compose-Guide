class ATL_SUIT_X88
{
	constructor()
	{
		this.modname = "ATLAS_CLOTHING_X88";
		Logger.info(`Loading: ${this.modname}`);
		ModLoader.onLoad[this.modname] = this.load.bind(this);
	}

	load()
	{
		// bundle path = thismodfolder/bundles/...
		const itemUpperBundle = "ATL_X88_UPPER.bundle"; // CAB- 7c24569acd49677632a4ca922f14166f === 7c24569acd49677632a4ca922a88888a
		const itemHandsBundle = "ATL_X88_HANDS.bundle"; // CAB- 1af8c9750f888df81cc387a046409bc2 === 1af8c9750f888df81cc387a888888at8
		const itemLowerBundle = "ATL_X88_LOWER.bundle"; // CAB- b9bf413169516699321696d7bec5129f === b9bf413169516699321696d7atl8888a

		// use unique item id's here
		const itemUpperId = "010421_CLOTHING_X88UPPR0";
		const itemHandsId = "010421_CLOTHING_X88HAND0";
		const itemLowerId = "010421_CLOTHING_X88LOWR0";
		const itemUpperSuitId = "010421_SUIT_UPPR_X88SUIT";
		const itemLowerSuitId = "010421_SUIT_LOWR_X88SUIT";

		// name displayed to player
		const itemUpperName = "ATLAS X88 Upper"; // upper name
		const itemLowerName = "ATLAS X88 Lower"; // lower name

		this.createItemUpper(itemUpperId, itemHandsId, itemUpperBundle, itemHandsBundle, itemUpperSuitId, itemUpperName);
		this.createItemLower(itemLowerId, itemLowerBundle, itemLowerSuitId, itemLowerName);
	}

	createItemUpper(i_uid, i_hid, i_ubundle, i_hbundle, i_usuitid, i_uname)
	{
		let itemUpper = JsonUtil.clone(DatabaseServer.tables.templates.customization["5f5e401747344c2e4f6c42c5"]); // copy 'BEAR G99 Upper'
		let itemHands = JsonUtil.clone(DatabaseServer.tables.templates.customization["5f5f3fa30bc58666c37e782e"]); // copy 'BEAR G99 Hands'
		let itemUpperSuit = JsonUtil.clone(DatabaseServer.tables.templates.customization["5f5f45df0bc58666c37e7832"]); // copy 'BEAR G99' suit

		// this is what others will see
		itemUpper._id = i_uid; // custom item ID
		itemUpper._name = i_uid; // need this for trader to access
		itemUpper._props.Side = ["Bear", "Usec"]; // which sides can have this?
		itemUpper._props.Prefab.path = i_ubundle; // 

		DatabaseServer.tables.templates.customization[i_uid] = itemUpper; // add item to database

		// this is what player will seen in first person
		itemHands._id = i_hid; // custom item ID
		itemHands._name = i_hid; // need this for trader to access
		itemHands._props.Side = ["Bear", "Usec"];
		itemHands._props.Prefab.path = i_hbundle; // 

		DatabaseServer.tables.templates.customization[i_hid] = itemHands; // add item to database

		// this is what player will see at traders
		itemUpperSuit._id = i_usuitid; // custom item ID
		itemUpperSuit._name = i_usuitid; // need this for trader to access
		itemUpperSuit._props.Side = ["Bear", "Usec"];
		itemUpperSuit._props.Body = i_uid;
		itemUpperSuit._props.Hands = i_hid;

		DatabaseServer.tables.templates.customization[i_usuitid] = itemUpperSuit;

		// add custom item name to all languages
		for (const localeID in DatabaseServer.tables.locales.global)
		{
			DatabaseServer.tables.locales.global[localeID].templates[i_usuitid] = {
				"Name": i_uname // item suit name
			}
		}

		// add to ragman
		DatabaseServer.tables.traders["5ac3b934156ae10c4430e83c"].suits.push(
		{
			"_id": i_uid, // item to add
			"tid": "5ac3b934156ae10c4430e83c", // trader ID
			"suiteId": i_usuitid, // suit ID
			"isActive": true,
			"requirements":
			{
				"loyaltyLevel": 1,
				"profileLevel": 8,
				"standing": 0,
				"skillRequirements": [],
				"questRequirements": [],
				"itemRequirements": [
				{
					"count": 88, // money count
					"_tpl": "5449016a4bdc2d6f028b456f" // RUB
				}]
			}
		});
	}

	createItemLower(i_lid, i_lbundle, i_lsuitid, i_lname)
	{
		let itemLower = JsonUtil.clone(DatabaseServer.tables.templates.customization["5f5e40a06760b4138443b341"]); // copy 'USEC Urban Responder Lower'
		let itemLowerSuit = JsonUtil.clone(DatabaseServer.tables.templates.customization["5f5f471bdf4f3100376a815e"]); // copy 'USEC Urban Responder Lower' suit

		// this is what others will see
		itemLower._id = i_lid; // custom item ID
		itemLower._name = i_lid; // need this for trader to access
		itemLower._props.Side = ["Bear", "Usec"]; // which sides can have this?
		itemLower._props.Prefab.path = i_lbundle; // CAB-b9bf413169516699321696d7bec5129f === CAB-b9bf413169516699321696d7atl8888a

		DatabaseServer.tables.templates.customization[i_lid] = itemLower; // add item to database

		itemLowerSuit._id = i_lsuitid; // custom item ID
		itemLowerSuit._name = i_lsuitid; // need this for trader to access
		itemLowerSuit._props.Side = ["Bear", "Usec"]; // which sides can have this?
		itemLowerSuit._props.Feet = i_lid;

		DatabaseServer.tables.templates.customization[i_lsuitid] = itemLowerSuit; // add item to database

		// add custom item name to all languages
		for (const localeID in DatabaseServer.tables.locales.global)
		{
			DatabaseServer.tables.locales.global[localeID].templates[i_lsuitid] = {
				"Name": i_lname // item suit name
			}
		}

		// add to ragman
		DatabaseServer.tables.traders["5ac3b934156ae10c4430e83c"].suits.push(
		{
			"_id": i_lid, // item to add
			"tid": "5ac3b934156ae10c4430e83c", // trader ID
			"suiteId": i_lsuitid, // suit ID
			"isActive": true,
			"requirements":
			{
				"loyaltyLevel": 1,
				"profileLevel": 8,
				"standing": 0,
				"skillRequirements": [],
				"questRequirements": [],
				"itemRequirements": [
				{
					"count": 88, // money count
					"_tpl": "5449016a4bdc2d6f028b456f" // RUB
				}]
			}
		});
	}
}

module.exports.ATL_SUIT_X88 = ATL_SUIT_X88;
