class ATL_REC_G17_FADE
{
constructor()
{
this.modname = "ATLAS_REC_G17_FADE";
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


const itemId = "010521_REC_G17_FADE_000";
const itemPrefabPath = "ATL_REC_G17_FADE.bundle";
const itemClone = "5a6f5f078dc32e00094b97dd";
const itemCategory = "5b5f764186f77447ec5d7714";
const itemLongName = "Glock 9x19 Viper Cut slide FADE";
const itemShortName = "Glock Viper FADE";
const itemDescription = "Custom, Atlas Glock 9x19 Viper Cut slide FADE. Lightweight slide for Glock 9x19 pistols.";
const itemFleaPrice = 33000;
const itemTrader = "5a7c2eca46aef81a7ca2145d";
const itemTraderPrice = 250;
const itemTraderCurrency = "569668774bdc2da2298b4568";
const itemTraderLV = 3;


this.createItemHandbookEntry(data_handbook, data_global, itemId, itemCategory, itemFleaPrice, itemLongName, itemShortName, itemDescription);
this.createItem(data_Items, itemId, itemClone);
this.createItemOffer(data_traders, itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
this.addItemTo(itemId)


data_Items[itemId]._props.Prefab.path = itemPrefabPath;
data_Items[itemId]._props.Ergonomics = 10;
data_Items[itemId]._props.Recoil = -7;
data_Items[itemId]._props.Velocity = 1;
}
addItemTo(i_id)
{
const itemPropsSlots = [
"5a7ae0c351dfba0017554310",
"5b1fa9b25acfc40018633c01"
]
for (let eachItem in itemPropsSlots)
{
let item = itemPropsSlots[eachItem];
DatabaseServer.tables.templates.items[item]._props.Slots[2]._props.filters[0].Filter.push(i_id);
}
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
}
module.exports.ATL_REC_G17_FADE = ATL_REC_G17_FADE;