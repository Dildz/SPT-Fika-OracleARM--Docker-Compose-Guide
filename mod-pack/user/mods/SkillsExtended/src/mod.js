"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceManager_1 = require("./InstanceManager");
const node_path_1 = __importDefault(require("node:path"));
const json5_1 = __importDefault(require("/snapshot/project/node_modules/json5"));
const Money_1 = require("/snapshot/project/obj/models/enums/Money");
const Traders_1 = require("/snapshot/project/obj/models/enums/Traders");
const BaseClasses_1 = require("/snapshot/project/obj/models/enums/BaseClasses");
var ItemIDS;
(function (ItemIDS) {
    ItemIDS["Lockpick"] = "6622c28aed7e3bc72e301e22";
    ItemIDS["Pda"] = "662400eb756ca8948fe64fe8";
})(ItemIDS || (ItemIDS = {}));
class SkillsExtended {
    Instance = new InstanceManager_1.InstanceManager();
    locale;
    customItemService;
    vfs;
    SkillsConfigRaw;
    SkillsConfig;
    preSptLoad(container) {
        this.Instance.preSptLoad(container, "Skills Extended");
        this.vfs = container.resolve("VFS");
        this.SkillsConfigRaw = this.vfs.readFile(node_path_1.default.join(__dirname, "../config/SkillsConfig.json5"));
        this.SkillsConfig = json5_1.default.parse(this.SkillsConfigRaw);
        this.registerRoutes();
    }
    postDBLoad(container) {
        this.Instance.postDBLoad(container);
        this.customItemService = container.resolve("CustomItemService");
        this.setLocales();
        this.CreateItems();
        this.addCraftsToDatabase();
        this.locale = this.Instance.database.locales.global;
    }
    setLocales() {
        const global = this.Instance.database.locales.global[this.SkillsConfig.Locale];
        const modPath = this.Instance.modPath;
        const locales = this.Instance.loadStringDictionarySync(`${modPath}/locale/${this.SkillsConfig.Locale}.json`);
        for (const entry in locales) {
            global[entry] = locales[entry];
        }
    }
    getKeys() {
        const items = Object.values(this.Instance.database.templates.items);
        const keys = {
            keyLocale: {}
        };
        const ItemHelper = this.Instance.itemHelper;
        const keyItems = items.filter(x => x._type === "Item"
            && ItemHelper.isOfBaseclasses(x._id, [BaseClasses_1.BaseClasses.KEY, BaseClasses_1.BaseClasses.KEY_MECHANICAL, BaseClasses_1.BaseClasses.KEYCARD]));
        for (const item of keyItems) {
            keys.keyLocale[item._id] = this.locale.en[`${item._id} Name`];
        }
        return JSON.stringify(keys);
    }
    registerRoutes() {
        this.Instance.staticRouter.registerStaticRouter("GetSkillsConfig", [
            {
                url: "/skillsExtended/GetSkillsConfig",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    return this.SkillsConfigRaw;
                }
            }
        ], "");
        this.Instance.staticRouter.registerStaticRouter("GetKeys", [
            {
                url: "/skillsExtended/GetKeys",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    return this.getKeys();
                }
            }
        ], "");
    }
    CreateItems() {
        this.CreateLockpick();
        this.CreatePDA();
    }
    // Clones factory key to be used as a blank for bump lock picking
    CreateLockpick() {
        const lockPick = {
            itemTplToClone: "5448ba0b4bdc2d02308b456c",
            overrideProperties: {
                CanSellOnRagfair: false,
                MaximumNumberOfUsage: 5,
                Unlootable: true,
                UnlootableFromSlot: "SpecialSlot",
                UnlootableFromSide: [
                    "Bear",
                    "Usec",
                    "Savage"
                ],
                Prefab: {
                    path: "lockpick.bundle",
                    rcid: ""
                },
                BackgroundColor: "orange"
            },
            parentId: "5c99f98d86f7745c314214b3",
            newId: ItemIDS.Lockpick,
            fleaPriceRoubles: 120000,
            handbookPriceRoubles: 75000,
            handbookParentId: "5c518ec986f7743b68682ce2",
            locales: {
                en: {
                    name: "Lockpick set",
                    shortName: "Lockpick",
                    description: "A set of tools used for picking locks"
                }
            }
        };
        this.customItemService.createItemFromClone(lockPick);
        const mechanic = this.Instance.database.traders[Traders_1.Traders.MECHANIC];
        mechanic.assort.items.push({
            _id: ItemIDS.Lockpick,
            _tpl: ItemIDS.Lockpick,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 10
            }
        });
        mechanic.assort.barter_scheme[ItemIDS.Lockpick] = [
            [
                {
                    count: 75000,
                    _tpl: Money_1.Money.ROUBLES
                }
            ]
        ];
        mechanic.assort.loyal_level_items[ItemIDS.Lockpick] = 2;
        this.addItemToSpecSlots(ItemIDS.Lockpick);
    }
    CreatePDA() {
        const Pda = {
            itemTplToClone: "5bc9b720d4351e450201234b",
            overrideProperties: {
                CanSellOnRagfair: false,
                Unlootable: true,
                UnlootableFromSlot: "SpecialSlot",
                UnlootableFromSide: [
                    "Bear",
                    "Usec",
                    "Savage"
                ],
                Prefab: {
                    path: "pda.bundle",
                    rcid: ""
                }
            },
            parentId: "5c164d2286f774194c5e69fa",
            newId: ItemIDS.Pda,
            fleaPriceRoubles: 3650000,
            handbookPriceRoubles: 7560000,
            handbookParentId: "5c164d2286f774194c5e69fa",
            locales: {
                en: {
                    name: "Flipper zero",
                    shortName: "Flipper",
                    description: "A hacking device used for gaining access to key card doors. Requires Lockpicking level 25 to use."
                }
            }
        };
        this.customItemService.createItemFromClone(Pda);
        const peaceKeeper = this.Instance.database.traders[Traders_1.Traders.PEACEKEEPER];
        peaceKeeper.assort.items.push({
            _id: ItemIDS.Pda,
            _tpl: ItemIDS.Pda,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 1
            }
        });
        peaceKeeper.assort.barter_scheme[ItemIDS.Pda] = [
            [
                {
                    count: 12600,
                    _tpl: Money_1.Money.DOLLARS
                }
            ]
        ];
        peaceKeeper.assort.loyal_level_items[ItemIDS.Pda] = 3;
        this.addItemToSpecSlots(ItemIDS.Pda);
    }
    addCraftsToDatabase() {
        const crafts = this.SkillsConfig.LockPickingSkill.CRAFTING_RECIPES;
        crafts.forEach((craft) => {
            this.Instance.database.hideout.production.push(craft);
        });
    }
    addItemToSpecSlots(itemId) {
        // Allow in spec slot
        const items = this.Instance.database.templates.items;
        for (const item in items) {
            const id = items[item]._id;
            if (id !== "627a4e6b255f7527fb05a0f6" && id !== "65e080be269cbd5c5005e529")
                continue;
            items[item]._props.Slots[0]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[1]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[2]._props.filters[0].Filter.push(itemId);
        }
    }
}
module.exports = { mod: new SkillsExtended() };
//# sourceMappingURL=mod.js.map