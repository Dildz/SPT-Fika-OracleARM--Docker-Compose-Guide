class ATL15_TAC_PEQ15
{
    constructor()
    {
        this.modname = "ATLAS_ATL15_TACTICAL_PEQ15";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        const itemId = "010421_ATL15_TAC_PEQ1500"; // unique item id, used in tarkov
        const itemClone = "544909bb4bdc2d6f028b4577" // base item, make clone from this

        // handbook
        const itemCategory = "5b5f737886f774093e6cb4fb"; // https://docs.sp-tarkov.com/#resources/items_stats.md -->> Weapon Parts & mod
        const itemFleaPrice = 22843; // Price of item on Fleamarket

        // item
        const itemPrefabPath = "ATL15_PEQ.bundle"; // Server/mods/this.modname/bundles/... CAB-825bc1cead28fa049967b7f9a8d02e2c === 16862944a87f033633d3018aeb87ce19
        const itemLongName = "ATL/PEQ-15 tactical device";
        const itemShortName = "ATL/PEQ-15";
        const itemDescription = "Custom, Atlas ATL/PEQ-15 tactical device. ATPIAL (Advanced Target Pointer Illuminator Aiming Laser). Tactical device that combines laser designators in both visible and IR band with IR searchlight.  Manufactured by A T L A S.";

        // offer
        const itemTrader = "5a7c2eca46aef81a7ca2145d"; //
        const itemTraderPrice = 22843;
        const itemTraderCurrency = "5449016a4bdc2d6f028b456f"; // RUB: 5449016a4bdc2d6f028b456f USD: 5696686a4bdc2da3298b456a EUR: 569668774bdc2da2298b4568
        const itemTraderLV = 4;

        this.addItemTo(itemId);
        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
        this.createItem(itemClone, itemId, itemPrefabPath);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);

        // add itemId to slots# on these itemId's
    }

    addItemTo(i_id)
    {
        // add this itemID to Slot# in other itemID
        DatabaseServer.tables.templates.items["010421_ATL15_HND_SMR_950"]._props.Slots[2]._props.filters[0].Filter.push(i_id); // ATL SMR95
        DatabaseServer.tables.templates.items["010421_ATL15_HND_SMR_130"]._props.Slots[3]._props.filters[0].Filter.push(i_id); // ATL SMR13
		
			DatabaseServer.tables.templates.items["57ffaea724597779f52b3a4d"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
			DatabaseServer.tables.templates.items["57a3459f245977764a01f703"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59eb7ebe86f7740b373438ce"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e569a132642e66b0b68015c"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b800ed086f7747baf6e2f9e"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5dfe14f30b92095fd441edaf"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["58a56f8d86f774651579314c"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55d48ebc4bdc2d8c2f8b456c"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b84038986f774774913b0c1"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5beecbb80db834001d2c465e"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9fc7e6a2750c0032157184"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cc7012ae4a949001252b43e"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59c63b4486f7747afb151c1c"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be4575acfc400161d0832"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cdeaca5d7f00c00b61c4b70"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cc70146e4a949000d73bf6b"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c0102aa0db834001b734ba1"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b30bc165acfc40016387293"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cc7015ae4a949001152b4c6"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5de8fc0b205ddc616a6bc51b"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ab24ef9e5b5b00fe93c9209"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5df35ea9c41b2312ea3334d8"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5df35eb2b11454561e3923e2"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fce0f9b55375d18a253eff2"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b4736a986f774040571e998"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be4645acfc400170e2dcc"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59e0bdb186f774156f04ce82"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59e0be5d86f7742d48765bd2"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be47f5acfc400170e2dd2"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fc5396e900b1d5091531e72"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9d6d00a2750c5c985b5305"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d0236dad7ad1a0940739d29"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bfeb32b0db834001a6694d9"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55d459824bdc2d892f8b4573"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9d56c8a2750c0032157146"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5888976c24597754281f93f5"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            //DatabaseServer.tables.templates.items["5648b2414bdc2d3b4c8b4578"]._props.Slots[0]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["59ccfdba86f7747f2109a587"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b237e425acfc4771e1be0b6"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["57ffaea724597779f52b3a4d"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59eb7ebe86f7740b373438ce"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5eeb2ff5ea4f8b73c827350b"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55d48ebc4bdc2d8c2f8b456c"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bbdb811d4351e45020113c7"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["591ee00d86f774592f7b841e"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59c63b4486f7747afb151c1c"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["593d1fa786f7746da62d61ac"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addbfd15acfc40015621bde"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fbb978207e8a97d1f0902d3"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b30bc285acfc47a8608615d"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9d6d21a2750c00137fa649"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addbfbb5acfc400194dbcf7"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addbf175acfc408fb13965b"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648b4534bdc2d3d1c8b4580"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9548c9159bd400133e97b3"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["57ffa9f4245977728561e844"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d010d1cd7ad1a59283b1ce7"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59fb375986f7741b681b81a6"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c617a5f2e2216000f1e81b3"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5efaf417aeb21837e749c7f2"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["595cfa8b86f77427437e845b"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648ae314bdc2d3d1c8b457f"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["595cf16b86f77427440c32e2"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cbda392ae92155f3c17c39f"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d15ce51d7ad1a1eff619092"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fc235db2770a0045c59c683"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5888976c24597754281f93f5"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5df916dfbb49d91fb446d6b9"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d19cd96d7ad1a4a992c9f52"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a26332e2216001219ea70"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b099a9d5acfc47a8607efe7"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d4405f0a4b9361e6a4e6bd9"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be1ca5acfc400170e2d2f"]._props.Slots[1]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
   
            DatabaseServer.tables.templates.items["59eb7ebe86f7740b373438ce"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5eeb2ff5ea4f8b73c827350b"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addc00b5acfc4001669f144"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55d48ebc4bdc2d8c2f8b456c"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bbdb811d4351e45020113c7"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a27bad7c4a282000b15184b"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["59c63b4486f7747afb151c1c"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["593d1fa786f7746da62d61ac"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fbb978207e8a97d1f0902d3"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addc7005acfc4001669f275"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d0236dad7ad1a0940739d29"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5afd7ded5acfc40017541f5e"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648b4534bdc2d3d1c8b4580"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9548c9159bd400133e97b3"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["57ffa9f4245977728561e844"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d010d1cd7ad1a59283b1ce7"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55f84c3c4bdc2d5f408b4576"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5efaf417aeb21837e749c7f2"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f6331e097199b7db2128dc2"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20df1d4351e00347787d5"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a957c3fa2750c00137fa5f7"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["588b56d02459771481110ae2"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648ae314bdc2d3d1c8b457f"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6d10fa2e221600106f3f23"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a9d6d34a2750c00141e07da"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a25172e2216000f20314e"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e5699df2161e06ac158df6f"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5827272a24597748c74bdeea"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a329052c4a28200741e22d3"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ef6dd7ad1a0940739b16"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["58272b392459774b4c7b3ccd"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ea16acdfadf1d18c87b0784"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ede1d7ad1a0940739a76"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d15ce51d7ad1a1eff619092"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d19cd96d7ad1a4a992c9f52"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a26332e2216001219ea70"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b099a9d5acfc47a8607efe7"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be1ca5acfc400170e2d2f"]._props.Slots[2]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5eeb2ff5ea4f8b73c827350b"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a27bad7c4a282000b15184b"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["593d1fa786f7746da62d61ac"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addc7005acfc4001669f275"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d0236dad7ad1a0940739d29"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648b4534bdc2d3d1c8b4580"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20de5d4351e0035629e59"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55f84c3c4bdc2d5f408b4576"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5efaf417aeb21837e749c7f2"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f6331e097199b7db2128dc2"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20df1d4351e00347787d5"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a957c3fa2750c00137fa5f7"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6d11072e2216000e69d2e4"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c48a14f2e2216152006edd7"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7bee755acfc400196d5383"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["588b56d02459771481110ae2"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5dfcd0e547101c39625f66f9"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5648ae314bdc2d3d1c8b457f"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a25172e2216000f20314e"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e5699df2161e06ac158df6f"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5dcbd6b46ec07c0c4347a564"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5827272a24597748c74bdeea"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ef6dd7ad1a0940739b16"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6d5d8b2e221644fc630b39"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["58272b392459774b4c7b3ccd"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ede1d7ad1a0940739a76"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d15ce51d7ad1a1eff619092"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6c2c9c2e2216000f2002e4"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ea16ada09aa976f2e7a51be"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cde7afdd7f00c000d36b89d"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e56991336989c75ab4f03f6"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a26332e2216001219ea70"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b099a9d5acfc47a8607efe7"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20dfcd4351e00334c9e24"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be1ca5acfc400170e2d2f"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6d11152e2216000f2003e7"]._props.Slots[3]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5eeb2ff5ea4f8b73c827350b"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["593d1fa786f7746da62d61ac"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addc7005acfc4001669f275"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d0236dad7ad1a0940739d29"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20de5d4351e0035629e59"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5efaf417aeb21837e749c7f2"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f6331e097199b7db2128dc2"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20df1d4351e00347787d5"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5a957c3fa2750c00137fa5f7"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7bebc85acfc43bca706666"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d123102d7ad1a004e475fe5"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e5699df2161e06ac158df6f"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7bedd75acfc43d825283f9"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5beec3e30db8340019619424"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5827272a24597748c74bdeea"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["58272b392459774b4c7b3ccd"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d15ce51d7ad1a1eff619092"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20dfcd4351e00334c9e24"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fbcc3e4d6fa9c00c571bb58"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5894a5b586f77426d2590767"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fc3f2d5900b1d5091531e57"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5fb64bc92b1b027b1f50bcf2"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e81ebcd8e146c7080625e15"]._props.Slots[4]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5addc7005acfc4001669f275"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20de5d4351e0035629e59"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["55f84c3c4bdc2d5f408b4576"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["588b56d02459771481110ae2"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c6d10e82e221601da357b07"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d123102d7ad1a004e475fe5"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a25172e2216000f20314e"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e5699df2161e06ac158df6f"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ef6dd7ad1a0940739b16"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ede1d7ad1a0940739a76"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d122e7bd7ad1a07102d6d7f"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bb20dfcd4351e00334c9e24"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cf4e3f3d7f00c06595bc7f0"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5b7be1ca5acfc400170e2d2f"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bd70322209c4d00d7167b8f"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ba26383d4351e00334c93d9"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e81ebcd8e146c7080625e15"]._props.Slots[5]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5ab372a310e891001717f0d8"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c78f2492e221600114c9f04"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d123102d7ad1a004e475fe5"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c9a25172e2216000f20314e"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d00ef6dd7ad1a0940739b16"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c78f2612e221600114c9f0d"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d122e7bd7ad1a07102d6d7f"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5f63418ef5750b524b45f116"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cadfbf7ae92152ac412eeef"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bd70322209c4d00d7167b8f"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ba26383d4351e00334c93d9"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5e81ebcd8e146c7080625e15"]._props.Slots[6]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5c78f2492e221600114c9f04"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d123102d7ad1a004e475fe5"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c78f2612e221600114c9f0d"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d122e7bd7ad1a07102d6d7f"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cadfbf7ae92152ac412eeef"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5bd70322209c4d00d7167b8f"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5ba26383d4351e00334c93d9"]._props.Slots[7]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");

            DatabaseServer.tables.templates.items["5c78f2492e221600114c9f04"]._props.Slots[8]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c78f2612e221600114c9f0d"]._props.Slots[8]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5d122e7bd7ad1a07102d6d7f"]._props.Slots[8]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5cadfbf7ae92152ac412eeef"]._props.Slots[8]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
        
            DatabaseServer.tables.templates.items["5c78f2492e221600114c9f04"]._props.Slots[9]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
            DatabaseServer.tables.templates.items["5c78f2612e221600114c9f0d"]._props.Slots[9]._props.filters[0].Filter.push("010421_ATL15_TAC_PEQ1500");
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

    createItem(i_clone, i_id, i_path)
    {
        let item = JsonUtil.clone(DatabaseServer.tables.templates.items[i_clone]); // https://items.sp-tarkov.com/
        // set clone item to custom itemId
        DatabaseServer.tables.templates.items[i_id] = item;

        // change item properties
        item._id = i_id;
        item._props.Prefab.path = i_path;
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

module.exports.ATL15_TAC_PEQ15 = ATL15_TAC_PEQ15;
