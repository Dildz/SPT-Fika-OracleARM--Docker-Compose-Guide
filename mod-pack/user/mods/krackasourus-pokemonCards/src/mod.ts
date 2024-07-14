import { DependencyContainer } from "tsyringe";
import { IPostsptLoadMod } from "@spt/models/external/IPostsptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { HashUtil } from "@spt/utils/HashUtil";
import { customItemConfigs } from "./item_configs";
import * as modConfig from "../config/mod_config.json";
import * as gift from "../config/gift/gift_config.json";
import * as relativeProbabilities from "../config/probabilities.json"


class Mod implements IPostsptLoadMod, IPostDBLoadMod 
{
    private logger: ILogger;
    private modName;
    private container: DependencyContainer;

    constructor() 
    {
        this.modName = "Pokemon Cards";
    }

    public async postsptLoad(container: DependencyContainer): Promise<void> 
    {
        this.container = container;
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        this.container = container;
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.log(`[${this.modName}] : Initializing`, "green");

        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const tables = databaseServer.getTables();
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        const configTraders = configServer.getConfigByString("spt-trader");
        const configInventory = configServer.getConfigByString("spt-inventory");
        const configRagfair = configServer.getConfigByString("spt-ragfair");
        const giftList = configServer.getConfigByString("spt-gifts");

        const fenceBlacklist = configTraders["fence"]["blacklist"]
        const ragfairBlacklist = configRagfair["dynamic"]["blacklist"]["custom"]


        const traderIDs = {
            mechanic: "5a7c2eca46aef81a7ca2145d",
            skier: "58330581ace78e27b8b10cee",
            peacekeeper: "5935c25fb3acc3127c3d8cd9",
            therapist: "54cb57776803fa99248b456e",
            prapor: "54cb50c76803fa8b248b4571",
            jaeger: "5c0647fdd443bc2504c2d371",
            ragman: "5ac3b934156ae10c4430e83c"
        };

        const currencyIDs = {
            roubles: "5449016a4bdc2d6f028b456f",
            euros: "569668774bdc2da2298b4568",
            dollars: "5696686a4bdc2da3298b456a"
        };

        // giftList["gifts"]["STARTERPACKS"] = gift.STARTERPACKS

        customItemConfigs.forEach(config => 
        {
            this.ensureCompatFilters(tables);
            const item = this.createCustomItem(jsonUtil, tables, config);
            tables.templates.items[config.id] = item;
            this.addLocales(locales, config);
            this.addItemToHandbook(handbook, config);
            this.addToTraderInventory(tables, config, traderIDs, currencyIDs);
            this.addToLootableContainers(tables, config);
            this.addToRandomLootContainers(configInventory, config);
            this.addItemToTrophyStand(tables, config)
            fenceBlacklist.push(config.id)
            ragfairBlacklist.push(config.id)
        });
        this.logger.log(`[${this.modName}] : Gotta Catch'em all`, "green");
    }

    private ensureCompatFilters(tables): void 
    {
        const compatFiltersElement = [{
            Filter: ["54009119af1c881c07000029"],
            ExcludedFilter: [""]
        }];

        for (const itemKey in tables.templates.items) 
        {
            const item = tables.templates.items[itemKey];
            if (["5448e53e4bdc2d60728b4567", "5448bf274bdc2dfc2f8b456a"].includes(item._parent) && item._id !== "5c0a794586f77461c458f892") 
            {
                if (!item._props.Grids[0]._props.filters) 
                {
                    item._props.Grids[0]._props.filters = compatFiltersElement;
                }
            }
        }
    }

    private createCustomItem(jsonUtil: JsonUtil, tables, config): any 
    {
        const item = jsonUtil.clone(tables.templates.items[config.clone_item]);
        item._id = config.id;
        item._name = config.item_name;
        item._props.Prefab.path = config.item_prefab_path;
        item._parent = config.item_parent;
        item._props.Name = config.item_name;
        item._props.ShortName = config.item_short_name;
        item._props.Description = config.item_description;
        item._props.StackMaxSize = config.stack_max_size;
        item._props.ItemSound = config.item_sound;
        item._props.Width = config.ExternalSize.width;
        item._props.Height = config.ExternalSize.height;
        item._props.Weight = config.weight;
        item._props.BackgroundColor = config.color;
        item._props.QuestItem = config.quest_item;
        item._props.InsuranceDisabled = config.insurancedisabled;
        item._props.IsAlwaysAvailableForInsurance = config.availableforinsurance;
        item._props.IsUnremovable = config.isunremovable;
        item._props.ExaminedByDefault = config.examinedbydefault;
        item._props.DiscardingBlock = config.discardingblock;
        item._props.IsUndiscardable = config.isundiscardable;
        item._props.IsUngivable = config.isungivable;
        item._props.DiscardLimit = config.discardlimit;
        item._props.CanSellOnRagfair = config.can_sell_on_ragfair;

        if (config.gridStructure) 
        {
            this.debug_to_console(`Creating grid for ${config.item_name}`, "blue")
            item._props.Grids = this.createGrid(config);
        }
        if (config.slotStructure) 
        {
            this.debug_to_console(`Creating slots for ${config.item_name}`, "blue")
            item._props.Slots = config.slotStructure;
        }

        return item;
    }

    private addLocales(locales, config): void 
    {
        locales.forEach(locale => 
        {
            locale[`${config.id} Name`] = config.item_name;
            locale[`${config.id} ShortName`] = config.item_short_name;
            locale[`${config.id} Description`] = config.item_description;
        });
    }

    private addItemToHandbook(handbook, config): void 
    {
        handbook.Items.push({
            Id: config.id,
            ParentId: config.category_id,
            Price: config.price
        });
    }

    private addToTraderInventory(tables, config, traderIDs, currencyIDs): void 
    {
        if (config.sold) 
        {
            this.debug_to_console(`Adding ${config.item_name} to ${config.trader}`, "blue")

            const traderId = traderIDs[config.trader] || config.trader;
            const currencyId = currencyIDs[config.currency] || config.currency;
            let trader = tables.traders[traderId];
            if (!trader) {
                trader = tables.traders[traderIDs[modConfig.fallback_trader]];
            }

            trader.assort.items.push({
                _id: config.id,
                _tpl: config.id,
                parentId: "hideout",
                slotId: "hideout",
                upd: {
                    UnlimitedCount: config.unlimited_stock,
                    StackObjectsCount: config.stock_amount
                }
            });

            trader.assort.barter_scheme[config.id] = [
                [
                    {
                        count: config.price,
                        _tpl: currencyId
                    }
                ]
            ];

            trader.assort.loyal_level_items[config.id] = config.trader_loyalty_level;
        }
    }

    private addToLootableContainers(tables, config): void 
    {   

        if (config.lootable && modConfig.enable_container_spawns) {
            const defaultContainerID = '5909d50c86f774659e6aaebe';
            this.debug_to_console(`Default container: ${defaultContainerID}`, "blue")
            const map = tables.locations[config.map];
            this.debug_to_console(`Map: ${config.map}`, "blue")
            const containerID = map.staticLoot[config.container] ? config.container : (map.staticLoot[defaultContainerID] ? defaultContainerID : null);
            this.debug_to_console(`selected containerDI: ${containerID}`, "blue")

            let probability = {
                "tpl": config.id,
                "relativeProbability": Math.ceil(relativeProbabilities[config.map][containerID]["max_found"] * modConfig[config.rarity])
            }
            const container = map.staticLoot[containerID];
            if (container.itemDistribution) {
                container.itemDistribution.push(probability);
            }
        }
    }

    private addToRandomLootContainers(configInventory, config): void 
    {
        if (config.is_loot_box) 
        {
            configInventory.randomLootContainers[config.id] = config.lootContent
            this.debug_to_console(`Adding ${config.item_name} to Random Loot Boxes list`, "blue")
        }
    }

    private createGrid(config): any[] 
    {
        const grids = [];
        const gridStructure = config.gridStructure;

        if (!gridStructure || gridStructure.length === 0) 
        {
            this.logger.log(`ERROR: Grid structure is undefined or empty.`, "red");
            return grids;
        }

        gridStructure.forEach((row, rowIndex) => 
        {
            if (!row) return;

            row.forEach((cellConfig, columnIndex) => 
            {
                if (!cellConfig) return;

                const cellHeight = cellConfig.height || 1;
                const cellWidth = cellConfig.width || 1;
                const inFilt = cellConfig.included_filter || [];
                const exFilt = cellConfig.excluded_filter || [];

                grids.push(this.generateColumn(config.id, `cell_${rowIndex}_${columnIndex}`, cellWidth, cellHeight, inFilt, exFilt));
            });
        });

        return grids;
    }

    private generateColumn(itemID, name, cellH, cellV, inFilt, exFilt): any 
    {
        if (!this.container) 
        {
            throw new Error("Container is not initialized");
        }

        const hashUtil = this.container.resolve<HashUtil>("HashUtil");
        return {
            _name: name,
            _id: hashUtil.generate(),
            _parent: itemID,
            _props: {
                filters: [
                    {
                        Filter: [...inFilt],
                        ExcludedFilter: [...exFilt]
                    }
                ],
                cellsH: cellH,
                cellsV: cellV,
                minCount: 0,
                maxCount: 0,
                maxWeight: 0,
                isSortingTable: false
            }
        };
    }

    private addItemToTrophyStand(tables: any, config: any): any {
        if (config.is_trophy) {
            const templates = tables.templates.items;
            const itemsToUpdate = [
                "63dbd45917fff4dee40fe16e",
                "65424185a57eea37ed6562e9",
                "6542435ea57eea37ed6562f0"
            ];

            itemsToUpdate.forEach(itemsToUpdate => {
                this.debug_to_console(itemsToUpdate, "red")
                const item = templates[itemsToUpdate];
                if (item && item._props && item._props.Slots) {
                    const slots = item._props.Slots;
                    slots.forEach((slot: any) => {
                        if (slot._name.includes("bigTrophies")) {
                            this.debug_to_console(`${config.item_name} added to ${slot._name}`, "yellow")
                            slot._props.filters.forEach((filterGroup: { Filter: string[] }) => {
                                filterGroup.Filter.push(config.id);
                            });
                        }
                    });
                }
            });
        }
    }

    private debug_to_console(string:string, color:string): any
    {
        if (modConfig.debug)
        {
            this.logger.log(`[${this.modName}] : ${string}`, color);
        }
    }
}

module.exports = { mod: new Mod() }
