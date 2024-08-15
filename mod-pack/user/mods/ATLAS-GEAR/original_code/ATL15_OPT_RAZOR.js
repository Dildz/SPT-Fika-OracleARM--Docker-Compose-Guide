class ATL15_OPT_RAZOR
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_OPT_RAZOR";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }
    load()
    {
        const data_base = DatabaseServer.tables;
        const data_Items = data_base.templates.items;
        const data_handbook = data_base.templates.handbook.Items;
        const data_global = data_base.locales.global;
        const data_traders = data_base.traders;

        const itemId = "010521_OPT_RAZOR_FDE0000";
        const itemPrefabPath = "ATL15_OPT_RAZOR_FDE.bundle";
        const itemClone = "59f9d81586f7744c7506ee62";
        const itemCategory = "5b5f742686f774093e6cb4ff";
        const itemLongName = "Vortex Razor AMG UH-1 holographic sight FDE";
        const itemShortName = "UH-1";
        const itemDescription = "Vortex Razor AMG UH-1 holographic sight FDE (Flat Dark Earth) is not only about futuristic design, but, according to its creators, is also a revolution among holographic and reflex sights. Manufactured by A T L A S.";
        const itemFleaPrice = 28691;
        const itemTrader = "5a7c2eca46aef81a7ca2145d";
        const itemTraderPrice = 28691;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f";
        const itemTraderLV = 4;

        this.addItemTo(itemId);
		this.createItemHandbookEntry(data_handbook, data_global, itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(data_Items, itemId, itemClone);
        this.createItemOffer(data_traders, itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
        this.addItemToSlots(itemId, data_Items)

        data_Items[itemId]._props.Prefab.path = itemPrefabPath;
    }
	addItemTo(i_id)
    {
			// 0
			DatabaseServer.tables.templates.items["59ccfdba86f7747f2109a587"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5b237e425acfc4771e1be0b6"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d4aab30a4b9365435358c55"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5cf656f2d7f00c06585fb6eb"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5caf1691ae92152ac412efb9"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["57ffaea724597779f52b3a4d"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5926dad986f7741f82604363"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5eeb2ff5ea4f8b73c827350b"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a7893c1c585673f2b5c374d"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5bc5a372d4351e44f824d17f"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addc00b5acfc4001669f144"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addbffe5acfc4001714dfac"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            // DatabaseServer.tables.templates.items["5648b6ff4bdc2d3d1c8b4581"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c61a40d2e2216001403158d"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5bbdb811d4351e45020113c7"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c90c3622e221601da359851"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["55d48a634bdc2d8b2f8b456a"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["591ee00d86f774592f7b841e"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["593d1fa786f7746da62d61ac"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a966ec8a2750c00171b3f36"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5e569a2e56edd02abe09f280"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5df35e970b92095fd441e4d2"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["57acb6222459771ec34b5cb0"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d024f5cd7ad1a04a067e91a"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5cc7015ae4a949001152b4c6"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5ab24ef9e5b5b00fe93c9209"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5f2aa49f9b44de6b1b4e68d4"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addbfd15acfc40015621bde"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a78948ec5856700177b1124"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5dff8db859400025ea5150d4"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5e569a0156edd02abe09f27d"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5cde7b43d7f00c000d36b93e"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c064c400db834001d23f468"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5de6558e9f98ac2bc65950fc"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addbfef5acfc400185c2857"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5bfebc530db834001d23eb65"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addbfe15acfc4001a5fc58b"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c61627a2e22160012542c55"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addbfbb5acfc400194dbcf7"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d0236dad7ad1a0940739d29"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["59fb375986f7741b681b81a6"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a9d56c8a2750c0032157146"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5827272a24597748c74bdeea"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["58272b392459774b4c7b3ccd"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            // DatabaseServer.tables.templates.items["5648b2414bdc2d3b4c8b4578"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5de8e67c4a9f347bc92edbd7"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d2c76ed48f03532f2136169"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d2c770c48f0354b4a07c100"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5fbcc3e4d6fa9c00c571bb58"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5649af884bdc2d1b2b8b4589"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5894a5b586f77426d2590767"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c0e2f26d174af02a9625114"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["55d355e64bdc2d962f8b4569"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5bb20d53d4351e4502010a69"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c07a8770db8340023300450"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["59bfe68886f7746004266202"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["59985a6c86f77414ec448d17"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5beec91a0db834001961942d"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5e0090f7e9dc277128008b93"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5df8e4080b92095fd441e594"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5b099bb25acfc400186331e8"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d2c772c48f0355d95672c25"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5d4405aaa4b9361e6a4e6bd3"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5fc278107283c4046c581489"]._props.Slots[0]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
			// 1
			DatabaseServer.tables.templates.items["5addc00b5acfc4001669f144"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5addc7005acfc4001669f275"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5648b4534bdc2d3d1c8b4580"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5efaf417aeb21837e749c7f2"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5f6331e097199b7db2128dc2"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a957c3fa2750c00137fa5f7"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5648ae314bdc2d3d1c8b457f"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5fc3e272f8b6a877a729eac5"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["55801eed4bdc2d89578b4588"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["588892092459774ac91d4b11"]._props.Slots[1]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
			// 2
			DatabaseServer.tables.templates.items["5afd7ded5acfc40017541f5e"]._props.Slots[2]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5f6331e097199b7db2128dc2"]._props.Slots[2]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5beec3e30db8340019619424"]._props.Slots[2]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5cc700ede4a949033c734315"]._props.Slots[2]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
			// 3
			DatabaseServer.tables.templates.items["5fc3f2d5900b1d5091531e57"]._props.Slots[3]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5fb64bc92b1b027b1f50bcf2"]._props.Slots[3]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5e81ebcd8e146c7080625e15"]._props.Slots[3]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
			// 4
			DatabaseServer.tables.templates.items["5a957c3fa2750c00137fa5f7"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5dfcd0e547101c39625f66f9"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5dcbd56fdbd3d91b3e5468d5"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5c488a752e221602b412af63"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5bd70322209c4d00d7167b8f"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5ba26383d4351e00334c93d9"]._props.Slots[4]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
			// 5
			DatabaseServer.tables.templates.items["5cadfbf7ae92152ac412eeef"]._props.Slots[5]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
            DatabaseServer.tables.templates.items["5a367e5dc4a282000e49738f"]._props.Slots[5]._props.filters[0].Filter.push("010521_OPT_RAZOR_FDE0000");
	}
    createItemHandbookEntry(db_handbook, db_global, i_id, i_category, i_fprice, i_lname, i_sname, i_desc)
    {
        db_handbook.push(
        {
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice,
        });
        for (const localeID in db_global)
        {
            db_global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            };
        }
    }
    createItem(db_items, i_id, i_clone)
    {
        let item = JsonUtil.clone(db_items[i_clone]);
        item._id = i_id;
        db_items[i_id] = item;
    }
    createItemOffer(db_traders, i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        db_traders[i_trader].assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectCount": 999999,
            }
        });
        db_traders[i_trader].assort.barter_scheme[i_id] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        db_traders[i_trader].assort.loyal_level_items[i_id] = i_loyalty;

        db_traders.ragfair.assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectCount": 999999
            }
        });
        db_traders.ragfair.assort.loyal_level_items[i_id] = 1;
    }
    addItemToSlots(i_id, db_items)
    {
        // add this itemID to Slot# in other itemID
        const itemPropsSlots = [
            "010421_ATL15_UPPER_BLK00", // ATL15 UPPER BLK
            "010421_ATL15_UPPER_FDE00" // ATL15 UPPER FDE
        ]
        for (let eachItem in itemPropsSlots) // loop through our items and add this itemId to Slots[#] of each
        {
            let item = itemPropsSlots[eachItem];
            db_items[item]._props.Slots[0]._props.filters[0].Filter.push(i_id);
        }

        // add this itemID to ConflictingItems in other itemID
        const itemPropsConflictingItems = [
            "5ae30bad5acfc400185c2dc4",
            "5bfd4c980db834001b73449d",
            "5d0a3a58d7ad1a669c15ca14",
            "5d0a3e8cd7ad1a6f6a3d35bd",
            "5a7c74b3e899ef0014332c29"
        ]
        for (let eachItem in itemPropsConflictingItems)
        {
            let item = itemPropsConflictingItems[eachItem];
            DatabaseServer.tables.templates.items[item]._props.ConflictingItems.push(i_id);
        }
    }
    addItemToSlots00(i_id, db_items)
    {
        const itemDatabase = [
            "59ccfdba86f7747f2109a587",
            "5b237e425acfc4771e1be0b6",
            "5d4aab30a4b9365435358c55",
            "5cf656f2d7f00c06585fb6eb",
            "5caf1691ae92152ac412efb9",
            "57ffaea724597779f52b3a4d",
            "5926dad986f7741f82604363",
            "5eeb2ff5ea4f8b73c827350b",
            "5a7893c1c585673f2b5c374d",
            "5bc5a372d4351e44f824d17f",
            "5addc00b5acfc4001669f144",
            "5addbffe5acfc4001714dfac",
            "5648b6ff4bdc2d3d1c8b4581",
            "5c61a40d2e2216001403158d",
            "5bbdb811d4351e45020113c7",
            "5c90c3622e221601da359851",
            "55d48a634bdc2d8b2f8b456a",
            "591ee00d86f774592f7b841e",
            "593d1fa786f7746da62d61ac",
            "5a966ec8a2750c00171b3f36",
            "5e569a2e56edd02abe09f280",
            "5df35e970b92095fd441e4d2",
            "57acb6222459771ec34b5cb0",
            "5d024f5cd7ad1a04a067e91a",
            "5cc7015ae4a949001152b4c6",
            "5ab24ef9e5b5b00fe93c9209",
            "5f2aa49f9b44de6b1b4e68d4",
            "5addbfd15acfc40015621bde",
            "5a78948ec5856700177b1124",
            "5dff8db859400025ea5150d4",
            "5e569a0156edd02abe09f27d",
            "5cde7b43d7f00c000d36b93e",
            "5c064c400db834001d23f468",
            "5de6558e9f98ac2bc65950fc",
            "5addbfef5acfc400185c2857",
            "5bfebc530db834001d23eb65",
            "5addbfe15acfc4001a5fc58b",
            "5c61627a2e22160012542c55",
            "5addbfbb5acfc400194dbcf7",
            "5d0236dad7ad1a0940739d29",
            "59fb375986f7741b681b81a6",
            "5a9d56c8a2750c0032157146",
            "5827272a24597748c74bdeea",
            "58272b392459774b4c7b3ccd",
            "5648b2414bdc2d3b4c8b4578",
            "5f63418ef5750b524b45f116",
            "5de8e67c4a9f347bc92edbd7",
            "5d2c76ed48f03532f2136169",
            "5d2c770c48f0354b4a07c100",
            "5fbcc3e4d6fa9c00c571bb58",
            "5649af884bdc2d1b2b8b4589",
            "5894a5b586f77426d2590767",
            "5c0e2f26d174af02a9625114",
            "55d355e64bdc2d962f8b4569",
            "5bb20d53d4351e4502010a69",
            "5c07a8770db8340023300450",
            "59bfe68886f7746004266202",
            "59985a6c86f77414ec448d17",
            "5beec91a0db834001961942d",
            "5e0090f7e9dc277128008b93",
            "5df8e4080b92095fd441e594",
            "5b099bb25acfc400186331e8",
            "5d2c772c48f0355d95672c25",
            "5d4405aaa4b9361e6a4e6bd3",
            "5fc278107283c4046c581489"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            db_items[item]._props.Slots[0]._props.filters[0].Filter.push(i_id);
        }
    }
    addItemToSlots01(i_id, db_items)
    {
        const itemDatabase = [
            "5addc00b5acfc4001669f144",
            "5ab372a310e891001717f0d8",
            "5addc7005acfc4001669f275",
            "5648b4534bdc2d3d1c8b4580",
            "5efaf417aeb21837e749c7f2",
            "5f6331e097199b7db2128dc2",
            "5a957c3fa2750c00137fa5f7",
            "5648ae314bdc2d3d1c8b457f",
            "5cf4e3f3d7f00c06595bc7f0",
            "5fc3e272f8b6a877a729eac5",
            "55801eed4bdc2d89578b4588",
            "588892092459774ac91d4b11"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            db_items[item]._props.Slots[1]._props.filters[0].Filter.push(i_id);
        }
    }
    addItemToSlots02(i_id, db_items)
    {
        const itemDatabase = [
            "5afd7ded5acfc40017541f5e",
            "5f6331e097199b7db2128dc2",
            "5beec3e30db8340019619424",
            "5cc700ede4a949033c734315"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            db_items[item]._props.Slots[2]._props.filters[0].Filter.push(i_id);
        }
    }
    addItemToSlots03(i_id, db_items)
    {
        const itemDatabase = [
            "5fc3f2d5900b1d5091531e57",
            "5fb64bc92b1b027b1f50bcf2",
            "5e81ebcd8e146c7080625e15"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            DatabaseServer.tables.templates.items[item]._props.Slots[3]._props.filters[0].Filter.push(i_id);
        }
    }
    addItemToSlots04(i_id, db_items)
    {
        const itemDatabase = [
            "5a957c3fa2750c00137fa5f7",
            "5dfcd0e547101c39625f66f9",
            "5dcbd56fdbd3d91b3e5468d5",
            "5c488a752e221602b412af63",
            "5bd70322209c4d00d7167b8f",
            "5ba26383d4351e00334c93d9"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            db_items[item]._props.Slots[4]._props.filters[0].Filter.push(i_id);
        }
    }
    addItemToSlots05(i_id, db_items)
    {
        const itemDatabase = [
            "5cadfbf7ae92152ac412eeef",
            "5a367e5dc4a282000e49738f"
        ]

        for (let eachItem in itemDatabase)
        {

            let item = itemDatabase[eachItem];
            db_items[item]._props.Slots[5]._props.filters[0].Filter.push(i_id);
        }
    }
}
module.exports.ATL15_OPT_RAZOR = ATL15_OPT_RAZOR;
