"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLootChanges = void 0;
const BaseClasses_1 = __importDefault(require("../Constants/BaseClasses"));
const utils_1 = require("./utils");
const nonPmcBotConfig_json_1 = __importDefault(require("../../config/nonPmcBotConfig.json"));
const buildLootChanges = (items, handbook, prices, _, botConfig, types) => {
    const assaultInventory = types.assault.inventory;
    const handbookMapper = {};
    // Zero out all current items
    for (const key in assaultInventory.items.Backpack) {
        assaultInventory.items.Backpack[key] = 1;
    }
    for (const key in assaultInventory.items.Pockets) {
        assaultInventory.items.Pockets[key] = 1;
    }
    for (const key in assaultInventory.items.TacticalVest) {
        assaultInventory.items.TacticalVest[key] = 1;
    }
    handbook.Items.forEach(({ Id, Price }) => {
        handbookMapper[Id] = Price;
    });
    const getFleaPrice = (itemID) => {
        if (typeof prices[itemID] != "undefined") {
            return prices[itemID];
        }
        else {
            return handbookMapper[itemID];
        }
    };
    const newToAdd = {
        [BaseClasses_1.default.BARTER_ITEM]: 50,
        [BaseClasses_1.default.HOUSEHOLD_GOODS]: 50,
        [BaseClasses_1.default.FOOD_DRINK]: 50,
        [BaseClasses_1.default.ELECTRONICS]: 1,
        [BaseClasses_1.default.JEWELRY]: 2,
        [BaseClasses_1.default.OTHER]: 1,
        [BaseClasses_1.default.TOOL]: 5,
        [BaseClasses_1.default.REPAIR_KITS]: 1,
        [BaseClasses_1.default.MONEY]: 1,
        "60b0f6c058e0b0481a09ad11": 1, //gingy
        "62a09d3bcf4a99369e262447": 1, //wallet
        "5783c43d2459774bbe137486": 1, //walletz
    };
    if (nonPmcBotConfig_json_1.default.addRandomizedKeysToScavs) {
        newToAdd[BaseClasses_1.default.KEY_MECHANICAL] = 1;
    }
    const itemsToRemove = new Set([
        BaseClasses_1.default.AMMO_BOX,
        BaseClasses_1.default.GEAR_MOD,
        BaseClasses_1.default.SILENCER,
        BaseClasses_1.default.KNIFE,
        BaseClasses_1.default.ASSAULT_SCOPE,
        BaseClasses_1.default.COLLIMATOR,
        BaseClasses_1.default.SPECIAL_SCOPE,
        BaseClasses_1.default.OPTIC_SCOPE,
        BaseClasses_1.default.FOREGRIP,
        BaseClasses_1.default.ARMOR,
        BaseClasses_1.default.VEST,
        BaseClasses_1.default.TACTICAL_COMBO,
    ]);
    const addList = Object.keys(newToAdd);
    const removeList = [...itemsToRemove];
    //limit keys on scavs
    botConfig.itemSpawnLimits.assault[BaseClasses_1.default.KEY_MECHANICAL] = 1;
    const randomlyAllowKey = (id) => {
        if ((0, utils_1.checkParentRecursive)(id, items, [BaseClasses_1.default.KEY_MECHANICAL]) &&
            Math.random() > nonPmcBotConfig_json_1.default.percentageOfKeysInSpawnPool) {
            // console.log(items[id]._name);
            return false;
        }
        return true;
    };
    const scavLootBlacklist = new Set(nonPmcBotConfig_json_1.default.scavLootBlacklist);
    const loot = Object.keys(items).filter((id) => !scavLootBlacklist.has(id) &&
        !utils_1.blacklistedItems.has(id) &&
        randomlyAllowKey(id) &&
        (0, utils_1.checkParentRecursive)(id, items, addList) &&
        !(0, utils_1.checkParentRecursive)(id, items, [BaseClasses_1.default.MONEY, ...removeList]) &&
        !items[id]?._props?.QuestItem &&
        !!getFleaPrice(id));
    const importedCustomLoot = nonPmcBotConfig_json_1.default?.additionalScavLoot.filter((id) => !!items[id] && !!getFleaPrice(id));
    const configmultiplier = 100 / nonPmcBotConfig_json_1.default.lootDisparityMultiplier;
    const allLoot = [...loot, ...importedCustomLoot]
        .map((id) => ({
        id,
        value: Math.round(getFleaPrice(id) / configmultiplier) || 1,
        name: items[id]._name,
    }))
        .sort(({ value: b }, { value: a }) => b - a);
    const reverseLoot = [...allLoot].reverse().map(({ value }) => value);
    const top = reverseLoot[Math.round(reverseLoot.length * 0.15)];
    const bottom = reverseLoot[Math.round(allLoot.length * 0.7)];
    const finalValues = {};
    allLoot.forEach(({ value, id, name }, index) => {
        let rarity = reverseLoot[index];
        switch (true) {
            case reverseLoot[index] > top:
                rarity = top;
                break;
            case reverseLoot[index] < bottom:
                rarity = Math.round(rarity * (0.3 / nonPmcBotConfig_json_1.default.lootDisparityMultiplier));
                break;
            default:
        }
        if ((0, utils_1.checkParentRecursive)(id, items, [utils_1.keyMechanical])) {
            rarity = Math.round(rarity * (Math.random() * Math.random())) || 1;
        }
        finalValues[id] = rarity;
    });
    // saveToFile(finalValues, "refDBS/allLoot.json");
    assaultInventory.items.Backpack = finalValues;
    assaultInventory.items.Pockets = finalValues;
    assaultInventory.items.TacticalVest = finalValues;
    // botConfig.walletLoot.chancePercent = 35;
    // botConfig.walletLoot.walletTplPool = [];
    itemsToRemove.forEach((id) => {
        if (botConfig.itemSpawnLimits.assault[id])
            delete botConfig.itemSpawnLimits.assault[id];
        if (assaultInventory.items.Backpack[id])
            delete assaultInventory.items.Backpack[id];
        if (assaultInventory.items.TacticalVest[id])
            delete assaultInventory.items.TacticalVest[id];
        if (assaultInventory.items.Pockets[id])
            delete assaultInventory.items.Pockets[id];
    });
    Object.keys(newToAdd).forEach((id) => {
        botConfig.itemSpawnLimits.assault[id] = newToAdd[id];
        botConfig.itemSpawnLimits.assaultgroup[id] = newToAdd[id];
    });
    return finalValues;
};
exports.buildLootChanges = buildLootChanges;
//# sourceMappingURL=LootChanges.js.map