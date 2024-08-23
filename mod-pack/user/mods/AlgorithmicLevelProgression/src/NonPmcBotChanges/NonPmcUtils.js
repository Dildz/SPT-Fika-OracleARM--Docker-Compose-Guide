"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyValuesToStoredEquipment = exports.buildEmptyWeightAdjustmentsByDevision = exports.buffScavGearAsLevel = exports.setPlateWeightings = exports.addItemsToBotInventory = exports.normalizeMedianInventoryValues = void 0;
const utils_1 = require("../LoadoutChanges/utils");
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const nonPmcBotConfig_json_1 = __importDefault(require("../../config/nonPmcBotConfig.json"));
const Ammo_1 = __importDefault(require("../Constants/Ammo"));
const Backpacks_1 = __importDefault(require("../Constants/Backpacks"));
// TODO: Fix adding items failing.
const equipmentToAdd = {
    // Headwear: Helmets,
    // ArmorVest: Armor,
    // TacticalVest: Vests,
    Backpack: Backpacks_1.default,
};
const equipmentTypesTochange = new Set([
    "Backpack",
    "Headwear",
    "ArmorVest",
    "FirstPrimaryWeapon",
    "TacticalVest",
    "Holster",
]);
const getRatingFuncForEquipmentType = (equipmentType, items) => {
    const equipmentFunctions = {
        Backpack: (item) => (0, utils_1.getBackPackInternalGridValue)(item) * 10,
        Headwear: (item) => (0, utils_1.getArmorRating)(item, items),
        ArmorVest: (item) => (0, utils_1.getArmorRating)(item, items),
        FirstPrimaryWeapon: utils_1.getWeaponWeighting,
        Holster: utils_1.getWeaponWeighting,
        TacticalVest: (item) => (0, utils_1.getTacticalVestValue)(item, items),
    };
    return equipmentFunctions[equipmentType];
};
const normalizeMedianInventoryValues = (inventory) => {
    for (const caliber in inventory.Ammo) {
        let highest = 0;
        Object.values(inventory.Ammo[caliber]).forEach((value) => {
            if (value > highest)
                highest = value;
        });
        const multiplier = 100 / highest;
        Object.keys(inventory.Ammo[caliber]).forEach((id) => {
            inventory.Ammo[caliber][id] =
                Math.round(inventory.Ammo[caliber][id] * multiplier) || 10;
        });
    }
    for (const equipmentType in inventory.equipment) {
        if (equipmentTypesTochange.has(equipmentType)) {
            let highest = 0;
            Object.values(inventory.equipment[equipmentType]).forEach((value) => {
                if (value > highest)
                    highest = value;
            });
            const multiplier = 200 / highest;
            Object.keys(inventory.equipment[equipmentType]).forEach((id) => {
                inventory.equipment[equipmentType][id] =
                    Math.round(inventory.equipment[equipmentType][id] * multiplier) || 10;
            });
        }
    }
};
exports.normalizeMedianInventoryValues = normalizeMedianInventoryValues;
const addItemsToBotInventory = (inventory, botToUpdate, items) => {
    const { Ammo: botToUpdateAmmo, BasePlateChance, PlateWeightings, ...equipment } = botToUpdate;
    Object.keys(equipmentToAdd).forEach((key) => {
        if (equipment[key]) {
            const equipmentStart = equipment[key][0];
            const equipmentEnd = equipment[key][1];
            if (equipmentStart || equipmentEnd) {
                const startIndex = Math.floor(equipmentToAdd[key].length * equipmentStart);
                const endIndex = Math.floor(equipmentToAdd[key].length * equipmentEnd);
                equipmentToAdd[key]
                    .slice(startIndex, endIndex)
                    .forEach((id) => {
                    if (!inventory.equipment[key][id]) {
                        inventory.equipment[key][id] = 1;
                    }
                    const item = items[id];
                    if (["Headwear", "ArmorVest", "TacticalVest"].includes(key)) {
                        if (item?._props?.Slots?.length > 0) {
                            if (!inventory.mods[id]) {
                                const newModObject = {};
                                item._props.Slots.forEach((mod) => {
                                    if (mod._props.filters[0].Plate) {
                                        newModObject[mod._name] = newModObject[mod._name] = [
                                            mod._props.filters[0].Plate,
                                        ];
                                    }
                                });
                                if (Object.keys(newModObject).length)
                                    inventory.mods[id] = newModObject;
                            }
                        }
                    }
                });
            }
        }
    });
    const ammoStart = botToUpdateAmmo[0];
    const ammoEnd = botToUpdateAmmo[1];
    if (ammoStart || ammoEnd) {
        const startIndex = Math.floor(Ammo_1.default.length * ammoStart);
        const endIndex = Math.floor(Ammo_1.default.length * ammoEnd);
        Ammo_1.default.slice(startIndex, endIndex).forEach((id) => {
            const calibre = items[id]?._props?.Caliber || items[id]?._props?.ammoCaliber;
            if (calibre &&
                inventory.Ammo[calibre] &&
                !inventory.Ammo?.[calibre]?.[id]) {
                inventory.Ammo[calibre][id] = 1;
            }
        });
    }
    // Add all plates to all equipment for all bots <<PLATE VARIETY>>
    Object.keys(inventory.mods).forEach((id) => {
        if ((0, utils_1.checkParentRecursive)(id, items, [utils_1.armorParent, utils_1.rigParent, utils_1.headwearParent])) {
            const item = items[id];
            if (item?._props?.Slots?.length > 0) {
                // if (!inventory.mods[id]) {
                const newModObject = {};
                item._props.Slots.forEach((mod) => {
                    if (mod._props.filters[0].Plate) {
                        newModObject[mod._name] = mod._props.filters[0].Filter;
                    }
                });
                if (Object.keys(newModObject).length)
                    inventory.mods[id] = newModObject;
            }
        }
    });
};
exports.addItemsToBotInventory = addItemsToBotInventory;
const defaultRandomisation = [
    {
        levelRange: {
            min: 1,
            max: 100,
        },
        equipmentMods: {},
    },
];
const setPlateWeightings = (name, equipmentFilters, index, equipment, items) => {
    if (!nonPmcBotConfig_json_1.default.nonPmcBots?.[name]?.BasePlateChance &&
        !nonPmcBotConfig_json_1.default.nonPmcBots?.[name]?.PlateWeightings) {
        return;
    }
    //=========================================
    // UPDATE PLATE SPAWN CHANCE
    if (!equipmentFilters?.randomisation) {
        equipmentFilters.randomisation = defaultRandomisation;
    }
    const randomizationToUpdate = (0, utils_1.cloneDeep)(equipmentFilters.randomisation[0]);
    if (nonPmcBotConfig_json_1.default.nonPmcBots?.[name]?.BasePlateChance &&
        nonPmcBotConfig_json_1.default.nonPmcBots[name].BasePlateChance < 100) {
        ["front_plate", "back_plate"].forEach((key) => {
            let value = nonPmcBotConfig_json_1.default.nonPmcBots[name].BasePlateChance + index * 15;
            if (value > 100)
                value = 100;
            randomizationToUpdate.equipmentMods[key] = value;
        });
        ["left_side_plate", "right_side_plate"].forEach((key) => {
            let value = nonPmcBotConfig_json_1.default.nonPmcBots[name].BasePlateChance - 60 + index * 20;
            if (value > 100)
                value = 100;
            if (value < 0)
                value = 0;
            randomizationToUpdate.equipmentMods[key] = value;
        });
    }
    equipmentFilters.randomisation[0] = randomizationToUpdate;
    //=========================================
    if (nonPmcBotConfig_json_1.default.nonPmcBots?.[name]?.PlateWeightings) {
        // const botPlateWeights = nonPmcBotConfig.nonPmcBots[name]
        //   .PlateWeightings as {
        //   "2": number;
        //   "3": number;
        //   "4": number;
        //   "5": number;
        //   "6": number;
        // }[];
        equipmentFilters.armorPlateWeighting = [
            {
                levelRange: {
                    min: 1,
                    max: 100,
                },
                // frontPlateWeights: {},
                // backPlateWeights: {},
                // sidePlateWeights: {},
            },
        ];
        const perplate = [
            "front_plate",
            "back_plate",
            "side_plate",
            "left_side_plate",
            "right_side_plate",
        ];
        perplate.forEach((key) => {
            equipmentFilters.armorPlateWeighting[0][key] =
                nonPmcBotConfig_json_1.default.nonPmcBots[name].PlateWeightings[index];
        });
        // const plating = equipmentFilters.armorPlateWeighting[0];
        // const front = {};
        // const back = {};
        // const side = {};
        // Object.keys(equipment.mods).forEach((id) => {
        //   if (
        //     checkParentRecursive(id, items, [
        //       armorParent,
        //       rigParent,
        //       headwearParent,
        //     ])
        //   ) {
        //     const mod = equipment.mods[id];
        //     ["Front_plate", "front_plate"].forEach((plateType) => {
        //       if (mod[plateType]) {
        //         mod[plateType].forEach((plateId) => {
        //           const rating =
        //             botPlateWeights?.[index]?.[items[plateId]._props.armorClass];
        //           if (rating) {
        //             plating.frontPlateWeights[plateId] = rating;
        //           }
        //         });
        //       }
        //     });
        //     ["Back_plate", "back_plate"].forEach((plateType) => {
        //       if (mod[plateType]) {
        //         mod[plateType].forEach((plateId) => {
        //           const rating =
        //             botPlateWeights?.[index]?.[items[plateId]._props.armorClass];
        //           if (rating) {
        //             plating.backPlateWeights[plateId] = rating;
        //           }
        //         });
        //       }
        //     });
        //     ["left_side_plate", "right_side_plate"].forEach((plateType) => {
        //       if (mod[plateType]) {
        //         mod[plateType].forEach((plateId) => {
        //           const rating =
        //             botPlateWeights?.[index]?.[items[plateId]._props.armorClass];
        //           if (rating) {
        //             plating.sidePlateWeights[plateId] = rating;
        //           }
        //         });
        //       }
        //     });
        //     // items[id]._props.Slots.forEach((mod) => {
        //     //   if (!mod._props.filters[0].locked) {
        //     //     names.add(mod._name);
        //     //   }
        //     // });
        //   }
        // });
        // // equipmentFilters.filterPlatesByLevel = true;
    }
    // saveToFile(equipmentFilters, name + "-filter.json");
};
exports.setPlateWeightings = setPlateWeightings;
const buffScavGearAsLevel = (equipmentFilters, index) => {
    equipmentFilters.weightingAdjustmentsByPlayerLevel = [
        {
            levelRange: {
                min: 1,
                max: 99,
            },
        },
    ];
    if (!index)
        return;
    const randomizationToUpdate = (0, utils_1.cloneDeep)(advancedConfig_json_1.default.otherBotTypes.assault.randomisation[0]);
    [
        "Headwear",
        "Earpiece",
        "ArmorVest",
        "FaceCover",
        "Scabbard",
        "Eyewear",
        "Backpack",
    ].forEach((key) => {
        randomizationToUpdate.equipment[key] += index * 15;
        if (randomizationToUpdate.equipment[key] > 99)
            randomizationToUpdate.equipment[key] = 99;
    });
    equipmentFilters.randomisation[0] = randomizationToUpdate;
    equipmentFilters.blacklist = advancedConfig_json_1.default.otherBotTypes.assault.blacklist;
    equipmentFilters.whitelist = advancedConfig_json_1.default.otherBotTypes.assault.whitelist;
};
exports.buffScavGearAsLevel = buffScavGearAsLevel;
const buildEmptyWeightAdjustmentsByDevision = (botToUpdate) => {
    const { tiers } = botToUpdate;
    const result = [];
    tiers.forEach((tier) => {
        result.push({
            levelRange: {
                min: tier[0],
                max: tier[1],
            },
            ammo: {},
            equipment: {},
        });
    });
    return result;
};
exports.buildEmptyWeightAdjustmentsByDevision = buildEmptyWeightAdjustmentsByDevision;
const applyValuesToStoredEquipment = (inventory, items, storedWeightingAdjustmentDetails) => {
    const ammoList = {};
    Object.keys(inventory.Ammo).forEach((key) => {
        ammoList[key] = [];
        Object.keys(inventory.Ammo[key]).forEach((id) => {
            //Zero out ammo
            ammoList[key].push({
                id,
                rating: (0, utils_1.getAmmoWeighting)(items[id]), // + inventory.Ammo[key][id],
            });
        });
    });
    Object.keys(ammoList).forEach((key) => {
        ammoList[key] = ammoList[key].sort((a, b) => a.rating - b.rating);
    });
    const equipmentList = {};
    Object.keys(inventory.equipment).forEach((key) => {
        if (equipmentTypesTochange.has(key)) {
            const ratingFunc = getRatingFuncForEquipmentType(key, items);
            equipmentList[key] = [];
            Object.keys(inventory.equipment[key]).forEach((id) => {
                //Zero out equipment
                if (key === "FirstPrimaryWeapon" || key === "Holster") {
                    const defAmmoWeight = (0, utils_1.getAmmoWeighting)(items[items[id]._props.defAmmo]);
                    equipmentList[key].push({
                        id,
                        rating: ratingFunc(items[id], defAmmoWeight),
                        // +  inventory.equipment[key][id],
                    });
                }
                else {
                    equipmentList[key].push({
                        id,
                        rating: ratingFunc(items[id]), //+ inventory.equipment[key][id],
                    });
                }
            });
        }
    });
    Object.keys(equipmentList).forEach((key) => {
        equipmentList[key] = equipmentList[key].sort((a, b) => a.rating - b.rating);
    });
    const division = storedWeightingAdjustmentDetails.length;
    for (let index = 0; index < division; index++) {
        const currentLevelRange = storedWeightingAdjustmentDetails[index];
        Object.keys(ammoList).forEach((key) => {
            const listPortion = ammoList[key];
            const quantityPerLevel = Math.round(listPortion.length / division);
            const resultingList = listPortion.slice(0, index === division - 1
                ? listPortion.length
                : index * quantityPerLevel + quantityPerLevel);
            resultingList.forEach(({ id, rating }) => {
                if (!currentLevelRange.ammo[key])
                    currentLevelRange.ammo[key] = {};
                currentLevelRange.ammo[key][id] =
                    Math.round(rating + rating * (index * 0.4)) + inventory.Ammo[key][id];
            });
        });
        Object.keys(equipmentList).forEach((key) => {
            const listPortion = equipmentList[key];
            const quantityPerLevel = Math.round(listPortion.length / division);
            const resultingList = listPortion.slice(0, index === division - 1
                ? listPortion.length
                : index * quantityPerLevel + quantityPerLevel);
            resultingList.forEach(({ id, rating }) => {
                if (!currentLevelRange.equipment[key])
                    currentLevelRange.equipment[key] = {};
                currentLevelRange.equipment[key][id] =
                    Math.round(rating + rating * (index * 0.4)) +
                        inventory.equipment[key][id];
            });
        });
    }
    storedWeightingAdjustmentDetails.forEach((_, index) => {
        const weight = storedWeightingAdjustmentDetails[index];
        Object.keys(weight.ammo).forEach((caliber) => {
            const caliberList = Object.keys(weight.ammo[caliber]).sort((a, b) => weight.ammo[caliber][b] - weight.ammo[caliber][a]);
            caliberList.forEach((id, rank) => {
                if (caliberList.length > 1 && rank > 0) {
                    if (rank > 3) {
                        weight.ammo[caliber][id] = Math.round(weight.ammo[caliber][id] * 0.5);
                    }
                    else {
                        const modifier = (caliberList.length - rank) / caliberList.length;
                        weight.ammo[caliber][id] =
                            Math.round(weight.ammo[caliber][id] * modifier) || 1;
                    }
                }
            });
        });
        // Apply randomness
        for (const category in weight.ammo) {
            const randomnessMultiplier = nonPmcBotConfig_json_1.default.botAmmoRandomness;
            if (!randomnessMultiplier)
                return;
            const list = weight.ammo[category];
            const keys = Object.keys(list);
            const sortedValues = Object.values(list).sort((a, b) => a - b);
            const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
            const medianValue = sortedValues[middleIndex];
            const highestValue = sortedValues[sortedValues.length - 1];
            const lowestValue = sortedValues[0];
            const betterValue = Math.round((medianValue + highestValue + lowestValue) / 3);
            if (betterValue > 1) {
                keys.forEach((key) => {
                    const valToAdjust = list[key];
                    if (valToAdjust > 5) {
                        const adjustedAmountMax = betterValue - valToAdjust;
                        const amountAfterAdjustment = Math.round(valToAdjust + adjustedAmountMax * randomnessMultiplier);
                        if (weight.ammo[category][key]) {
                            weight.ammo[category][key] = Math.abs(amountAfterAdjustment);
                        }
                    }
                });
            }
        }
        // Fix weapon weightings
        Object.keys(weight.equipment?.FirstPrimaryWeapon || []).forEach((id) => {
            const calibre = items[id]?._props?.Caliber || items[id]?._props?.ammoCaliber;
            if (calibre && weight.ammo[calibre]) {
                let highestRating = 0;
                Object.keys(weight.ammo[calibre]).forEach((key) => {
                    if (weight.ammo[calibre][key] > highestRating) {
                        highestRating = weight.ammo[calibre][key];
                    }
                });
                if (highestRating) {
                    weight.equipment.FirstPrimaryWeapon[id] = (0, utils_1.getWeaponWeighting)(items[id], highestRating);
                }
            }
        });
        for (const category in weight.equipment) {
            const randomnessMultiplier = nonPmcBotConfig_json_1.default.botEquipmentRandomness;
            if (!randomnessMultiplier)
                return;
            const list = weight.equipment[category];
            const keys = Object.keys(list);
            const sortedValues = Object.values(list).sort((a, b) => a - b);
            const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
            const medianValue = sortedValues[middleIndex];
            const highestValue = sortedValues[sortedValues.length - 1];
            const lowestValue = sortedValues[0];
            const betterValue = Math.round((medianValue + highestValue + lowestValue) / 3);
            if (betterValue > 1) {
                keys.forEach((key) => {
                    const valToAdjust = list[key];
                    if (valToAdjust > 5) {
                        const adjustedAmountMax = betterValue - valToAdjust;
                        const amountAfterAdjustment = Math.round(valToAdjust + adjustedAmountMax * randomnessMultiplier);
                        if (weight.equipment[category][key]) {
                            weight.equipment[category][key] = Math.abs(amountAfterAdjustment);
                        }
                    }
                });
            }
        }
    });
};
exports.applyValuesToStoredEquipment = applyValuesToStoredEquipment;
//# sourceMappingURL=NonPmcUtils.js.map