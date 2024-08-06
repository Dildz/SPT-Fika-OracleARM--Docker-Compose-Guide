/* eslint-disable @typescript-eslint/naming-convention */

import { InstanceManager } from "./InstanceManager";

import fs from 'fs';
import path from "node:path";
import JSON5 from "json5";

import type { DependencyContainer } from "tsyringe";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { CustomItemService } from "@spt/services/mod/CustomItemService";
import type { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails";
import type { VFS } from "@spt/utils/VFS";
import type { IKeys } from "./Models/IKeys";

import { Money } from "@spt/models/enums/Money";
import { Traders } from "@spt/models/enums/Traders";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

enum ItemIDS {
    Lockpick  = "6622c28aed7e3bc72e301e22",
    Pda = "662400eb756ca8948fe64fe8"
}

class SkillsExtended implements IPreSptLoadMod, IPostDBLoadMod
{
    private Instance: InstanceManager = new InstanceManager();
    private locale: Record<string, Record<string, string>>; 
    private customItemService: CustomItemService;
    private vfs: VFS;
    private SkillsConfigRaw;
    private SkillsConfig;

    public preSptLoad(container: DependencyContainer): void 
    {
        this.Instance.preSptLoad(container, "Skills Extended");
        
        this.Instance.logger.logWithColor("Skills Extended loading", LogTextColor.GREEN);
        
        this.vfs = container.resolve<VFS>("VFS");
        this.SkillsConfigRaw = this.vfs.readFile(path.join(path.dirname(__filename), "..", "config", "SkillsConfig.json5"));
        this.SkillsConfig = JSON5.parse(this.SkillsConfigRaw);

        this.registerRoutes();
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        this.Instance.postDBLoad(container);
        this.customItemService = container.resolve<CustomItemService>("CustomItemService");

        this.Instance.logger.logWithColor("Did you know, BSG has 10 faction specific skills they're too lazy to implement?", LogTextColor.BLUE);

        this.setLocales();
        this.CreateItems();
        this.addCraftsToDatabase();
        this.locale = this.Instance.database.locales.global;
    }

    private setLocales(): void
    {
        const localePath = path.join(path.dirname(__filename), "..", "locale");
        const files = fs.readdirSync(localePath);
        
        const jsonFiles = files
            .filter(file => path.extname(file) === ".json")
            .map(file => path.basename(file, ".json"));

        for (const file of jsonFiles)
        {
            // Portugeese locale uses `po` not `pt`
            // Skip because I originally set it as pt by mistake.
            // Dont trust users to delete my mistake /BONK
            if (file === "pt") continue;

            const filePath = path.join(path.dirname(__filename), "..", "locale", `${file}.json`);
            const localeFile = this.Instance.loadStringDictionarySync(filePath);
            const global = this.Instance.database.locales.global[file];

            this.Instance.logger.logWithColor(`Loading locale: ${file}`, LogTextColor.GREEN);

            for (const locale in localeFile)
            {
                global[locale] = localeFile[locale];
            }
        }

        this.Instance.logger.logWithColor("Skills Extended: Locales dynamically loaded. Select your locale in-game on the settings page!", LogTextColor.GREEN);
    }

    private getKeys(): string
    {
        const items = Object.values(this.Instance.database.templates.items);

        const keys: IKeys = {
            keyLocale: {}
        }

        const ItemHelper = this.Instance.itemHelper;
        
        const keyItems = items.filter(x => 
            x._type === "Item" 
            && ItemHelper.isOfBaseclasses(x._id, [BaseClasses.KEY, BaseClasses.KEY_MECHANICAL, BaseClasses.KEYCARD]))
            
        for (const item of keyItems)
        {
            keys.keyLocale[item._id] = this.locale.en[`${item._id} Name`];
        }

        return JSON.stringify(keys);
    }

    private registerRoutes(): void
    {
        this.Instance.staticRouter.registerStaticRouter(
            "GetSkillsConfig",
            [
                {
                    url: "/skillsExtended/GetSkillsConfig", 
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    action: async (url, info, sessionId, output) => 
                    {                     
                        return this.SkillsConfigRaw;
                    }
                }
            ],
            ""
        );

        this.Instance.staticRouter.registerStaticRouter(
            "GetKeys",
            [
                {
                    url: "/skillsExtended/GetKeys",
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    action: async (url, info, sessionId, output) => 
                    {                     
                        return this.getKeys();
                    }
                }
            ],
            ""
        );
    }

    private CreateItems(): void
    {
        this.CreateLockpick();
        this.CreatePDA();
    }

    // Clones factory key to be used as a blank for bump lock picking
    private CreateLockpick(): void
    {
        const lockPick: NewItemFromCloneDetails = {
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
        }

        this.customItemService.createItemFromClone(lockPick);

        const mechanic = this.Instance.database.traders[Traders.MECHANIC];
        
        mechanic.assort.items.push({
            _id: ItemIDS.Lockpick,
            _tpl: ItemIDS.Lockpick,
            parentId: "hideout",
            slotId: "hideout",
            upd:
            {
                UnlimitedCount: false,
                StackObjectsCount: 10
            }
        });

        mechanic.assort.barter_scheme[ItemIDS.Lockpick] = [
            [
                {
                    count: 75000,
                    _tpl: Money.ROUBLES
                }
            ]
        ];
        
        mechanic.assort.loyal_level_items[ItemIDS.Lockpick] = 2;

        this.addItemToSpecSlots(ItemIDS.Lockpick);
    }

    private CreatePDA(): void
    {
        const Pda: NewItemFromCloneDetails = {
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
        }

        this.customItemService.createItemFromClone(Pda);
        
        const peaceKeeper = this.Instance.database.traders[Traders.PEACEKEEPER];

        peaceKeeper.assort.items.push({
            _id: ItemIDS.Pda,
            _tpl: ItemIDS.Pda,
            parentId: "hideout",
            slotId: "hideout",
            upd:
            {
                UnlimitedCount: false,
                StackObjectsCount: 1
            }
        });

        peaceKeeper.assort.barter_scheme[ItemIDS.Pda] = [
            [
                {
                    count: 12600,
                    _tpl: Money.DOLLARS
                }
            ]
        ];
        
        peaceKeeper.assort.loyal_level_items[ItemIDS.Pda] = 3;

        this.addItemToSpecSlots(ItemIDS.Pda);
    }

    private addCraftsToDatabase(): void
    {
        const crafts = this.SkillsConfig.LockPickingSkill.CRAFTING_RECIPES;

        crafts.forEach((craft) => {
            this.Instance.database.hideout.production.push(craft);
        })
    }

    private addItemToSpecSlots(itemId: string): void
    {
        // Allow in spec slot
        const items = this.Instance.database.templates.items;

        for (const item in items)
        {
            const id = items[item]._id;
            
            if (id !== "627a4e6b255f7527fb05a0f6" && id !== "65e080be269cbd5c5005e529") continue;

            items[item]._props.Slots[0]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[1]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[2]._props.filters[0].Filter.push(itemId);
        }
    }
}

module.exports = { mod: new SkillsExtended() }