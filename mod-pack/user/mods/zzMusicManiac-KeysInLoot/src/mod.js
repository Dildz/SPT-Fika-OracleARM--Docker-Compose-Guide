"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClasses_1 = require("/snapshot/project/obj/models/enums/BaseClasses");
const jsonc_1 = require("/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
class KeysInLoot {
    logger;
    mod;
    modShortName;
    constructor() {
        this.mod = "MusicManiac-KeysInLoot";
        this.modShortName = "KeysInLoot";
    }
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const logger = this.logger;
        logger.info(`[${this.modShortName}] ${this.mod} started loading`);
        const itemHelper = container.resolve("ItemHelper");
        const db = container.resolve("DatabaseServer");
        const vfs = container.resolve("VFS");
        const config = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config.jsonc")));
        let tables = db.getTables();
        const itemDB = tables.templates.items;
        const handbookPrices = tables.templates.handbook.Items;
        const fleaPrices = tables.templates.prices;
        let keys = [];
        for (let item in itemDB) {
            const itemId = itemDB[item]._id;
            //
            if (itemDB[item]._type == "Item") {
                if ((itemHelper.isOfBaseclass(itemId, BaseClasses_1.BaseClasses.KEY_MECHANICAL) && config.keyWeight !== 0)
                    || (itemHelper.isOfBaseclass(itemId, BaseClasses_1.BaseClasses.KEYCARD) && config.keycardWeight !== 0)) {
                    keys.push(itemId);
                    const itemToModify = handbookPrices.find(item => item.Id === itemId);
                    if (itemToModify) {
                        itemToModify.Price = Math.round(itemToModify.Price * config.keyTraderPricesMultiplier);
                    }
                    if (fleaPrices[itemId]) {
                        fleaPrices[itemId] = Math.round(fleaPrices[itemId] * config.keyFleaPricesMultiplier);
                    }
                }
            }
        }
        let adjustedWeights = 0;
        let addedKeys = 0;
        const maps = ["bigmap", "factory4_day", "factory4_night", "interchange", "laboratory", "lighthouse", "rezervbase", "sandbox", "sandbox_high", "shoreline", "tarkovstreets", "woods"];
        for (const map of maps) {
            if (config.keyWeight !== 0) {
                for (const key of keys) {
                    try {
                        if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f8778245977358849a9b5"]) {
                            const jacket = tables.locations[map].staticLoot["578f8778245977358849a9b5"];
                            const foundKeyJacket = jacket.itemDistribution.find(item => item.tpl === key);
                            if (foundKeyJacket) {
                                if (foundKeyJacket.relativeProbability < config.keyWeight) {
                                    foundKeyJacket.relativeProbability = config.keyWeight;
                                    adjustedWeights++;
                                }
                            }
                            else {
                                jacket.itemDistribution.push({
                                    tpl: key,
                                    relativeProbability: config.keyWeight
                                });
                                addedKeys++;
                            }
                            jacket.itemcountDistribution = config.overRideLootDistributionJackets;
                        }
                    }
                    catch (error) {
                        console.error(`Error processing jacket on map ${map}`, error);
                    }
                    try {
                        if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f87a3245977356274f2cb"]) {
                            const duffleBag = tables.locations[map].staticLoot["578f87a3245977356274f2cb"];
                            const foundKeyDuffle = duffleBag.itemDistribution.find(item => item.tpl === key);
                            if (foundKeyDuffle) {
                                if (foundKeyDuffle.relativeProbability < config.keyWeight) {
                                    foundKeyDuffle.relativeProbability = config.keyWeight;
                                    adjustedWeights++;
                                }
                            }
                            else {
                                duffleBag.itemDistribution.push({
                                    tpl: key,
                                    relativeProbability: config.keyWeight
                                });
                                addedKeys++;
                            }
                            duffleBag.itemcountDistribution = config.overRideLootDistributionDuffleBags;
                        }
                    }
                    catch (error) {
                        console.error(`Error processing dufflebag on map ${map}`, error);
                    }
                    try {
                        if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"]) {
                            const deadScav = tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"];
                            const foundDeadScav = deadScav.itemDistribution.find(item => item.tpl === key);
                            if (foundDeadScav) {
                                if (foundDeadScav.relativeProbability < config.keyWeight) {
                                    foundDeadScav.relativeProbability = config.keyWeight;
                                    adjustedWeights++;
                                }
                            }
                            else {
                                deadScav.itemDistribution.push({
                                    tpl: key,
                                    relativeProbability: config.keyWeight
                                });
                                addedKeys++;
                            }
                            deadScav.itemcountDistribution = config.overRideLootDistributionDeadScavs;
                        }
                    }
                    catch (error) {
                        console.error(`Error processing deadScav on map ${map}`, error);
                    }
                }
            }
        }
        logger.info(`[${this.modShortName}] ${adjustedWeights} keys weights were adjusted`);
        logger.info(`[${this.modShortName}] different keys were added ${addedKeys} times to jacket/duffle/dead scav loot`);
        itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsH = config.cellsH;
        itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsV = config.cellsV;
        logger.success(`[${this.modShortName}] ${this.mod} finished loading`);
    }
}
module.exports = { mod: new KeysInLoot() };
//# sourceMappingURL=mod.js.map