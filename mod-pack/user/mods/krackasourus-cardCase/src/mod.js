"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_ids_1 = require("./card_ids");
const newIdMap = __importStar(require("../config/new_id.json"));
const modConfig = __importStar(require("../config/mod_config.json"));
const caseConfig = __importStar(require("../config/card_case.json"));
class CardCase {
    logger;
    modName;
    container;
    profileHelper;
    constructor() {
        this.modName = "Card Case";
    }
    preSptLoad(container) {
        this.container = container;
        this.fixStupidMongoIds();
    }
    postDBLoad(container) {
        this.container = container;
        this.logger = container.resolve("WinstonLogger");
        this.logger.log(`[${this.modName}] : Initializing`, "green");
        this.profileHelper = container.resolve("ProfileHelper");
        const jsonUtil = container.resolve("JsonUtil");
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const tables = databaseServer.getTables();
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global);
        const configTraders = configServer.getConfigByString("spt-trader");
        const configRagfair = configServer.getConfigByString("spt-ragfair");
        const fenceBlacklist = configTraders["fence"]["blacklist"];
        const ragfairBlacklist = configRagfair["dynamic"]["blacklist"]["custom"];
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
        const item = this.createCustomItem(jsonUtil, tables, caseConfig);
        tables.templates.items[caseConfig.id] = item;
        this.addLocales(locales, caseConfig);
        this.addItemToHandbook(handbook, caseConfig);
        this.addToTraderInventory(tables, caseConfig, traderIDs, currencyIDs);
        this.addItemToTrophyStand(tables, caseConfig);
        fenceBlacklist.push(caseConfig.id);
        ragfairBlacklist.push(caseConfig.id);
        this.logger.log(`[${this.modName}] : Show me what you got!`, "green");
    }
    createCustomItem(jsonUtil, tables, config) {
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
        let filter = [];
        card_ids_1.cardIDs.forEach(id => {
            filter.push(id);
            this.debug_to_console(`Added ${id} to card case`, "blue");
        });
        item._props.Slots = [
            {
                "_name": "mod_mount_1",
                "_id": "card_slot",
                "_parent": config.id,
                "_props": {
                    "filters": [
                        {
                            "Shift": 0,
                            "Filter": filter
                        }
                    ]
                },
                "_required": false,
                "_mergeSlotWithChildren": false,
                "_proto": "55d30c4c4bdc2db4468b457e"
            }
        ];
        return item;
    }
    addLocales(locales, config) {
        locales.forEach(locale => {
            locale[`${config.id} Name`] = config.item_name;
            locale[`${config.id} ShortName`] = config.item_short_name;
            locale[`${config.id} Description`] = config.item_description;
        });
    }
    addItemToHandbook(handbook, config) {
        handbook.Items.push({
            Id: config.id,
            ParentId: config.category_id,
            Price: config.price
        });
    }
    addToTraderInventory(tables, config, traderIDs, currencyIDs) {
        if (config.sold) {
            this.debug_to_console(`Adding ${config.item_name} to ${config.trader}`, "blue");
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
    addItemToTrophyStand(tables, config) {
        if (config.is_trophy) {
            const templates = tables.templates.items;
            const itemsToUpdate = [
                "63dbd45917fff4dee40fe16e",
                "65424185a57eea37ed6562e9",
                "6542435ea57eea37ed6562f0"
            ];
            itemsToUpdate.forEach(itemsToUpdate => {
                const item = templates[itemsToUpdate];
                if (item && item._props && item._props.Slots) {
                    const slots = item._props.Slots;
                    slots.forEach((slot) => {
                        if (slot._name.includes("bigTrophies")) {
                            slot._props.filters.forEach((filterGroup) => {
                                filterGroup.Filter.push(config.id);
                            });
                        }
                    });
                }
            });
        }
    }
    fixStupidMongoIds() {
        // On game start, see if we need to fix issues from previous versions
        // Note: We do this as a method replacement so we can run _before_ SPT's gameStart
        this.container.afterResolution("GameController", (_, result) => {
            const originalGameStart = result.gameStart;
            result.gameStart = (url, info, sessionID, startTimeStampMS) => {
                // If there's a profile ID passed in, call our fixer method
                if (sessionID) {
                    console.log("Starting game for " + sessionID);
                    this.fixProfile(sessionID);
                }
                // Call the original
                originalGameStart.apply(result, [url, info, sessionID, startTimeStampMS]);
            };
        });
    }
    // Handle updating the user profile between versions:
    // - Update the container IDs to the new MongoID format
    // - Look for any key cases in the user's inventory, and properly update the child key locations if we've moved them
    fixProfile(sessionId) {
        const pmcProfile = this.profileHelper.getFullProfile(sessionId)?.characters?.pmc;
        console.log("Checking for profile");
        // Do nothing if the profile isn't initialized
        if (!pmcProfile?.Inventory?.items)
            return;
        console.log("Invetory found");
        // Update the container IDs to the new MongoID format for inventory items
        pmcProfile.Inventory.items.forEach(item => {
            if (newIdMap[item._tpl]) {
                item._tpl = newIdMap[item._tpl];
                console.log("Updated profile item to " + item._tpl);
            }
        });
        // Helper function to update rewards for quests
        const updateQuestRewards = (quests) => {
            if (!quests)
                return;
            quests.forEach(quest => {
                if (quest.rewards?.Success) {
                    quest.rewards.Success.forEach(reward => {
                        if (newIdMap[reward._tpl]) {
                            reward._tpl = newIdMap[reward._tpl];
                        }
                        if (Array.isArray(reward.items)) {
                            reward.items.forEach(item => {
                                if (newIdMap[item._tpl]) {
                                    item._tpl = newIdMap[item._tpl];
                                    //console.log("Updated reward item to " + item._tpl);
                                }
                            });
                        }
                    });
                }
            });
        };
        // Update rewards for Repeatable Quests
        pmcProfile.RepeatableQuests.forEach(questType => {
            updateQuestRewards(questType.activeQuests);
            updateQuestRewards(questType.inactiveQuests);
        });
    }
    debug_to_console(string, color) {
        if (modConfig.debug) {
            this.logger.log(`[${this.modName}] : ${string}`, color);
        }
    }
}
module.exports = { mod: new CardCase() };
//# sourceMappingURL=mod.js.map