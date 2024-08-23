"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScopes = exports.cullModItems = exports.makeMapSpecificWeaponWeightings = exports.makeRandomisationAdjustments = void 0;
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const utils_1 = require("./utils");
const InternalBlacklist_1 = __importDefault(require("./InternalBlacklist"));
const GlobalValues_1 = require("./GlobalValues");
const makeRandomisationAdjustments = (isNight, originalWeight, randomisation, location) => {
    const noNvgNeeded = ["factory4_day", "factory4_night", "laboratory"].includes(location);
    // levelRange: MinMax;
    // generation?: Record<string, GenerationData>;
    // /** Mod slots that should be fully randomised -ignores mods from bottype.json and instaed creates a pool using items.json */
    // randomisedWeaponModSlots?: string[];
    // /** Armor slots that should be randomised e.g. 'Headwear, Armband' */
    // randomisedArmorSlots?: string[];
    // /** Equipment chances */
    // equipment?: Record<string, number>;
    // /** Weapon mod chances */
    // weaponMods?: Record<string, number>;
    // /** Equipment mod chances */
    // equipmentMods?: Record<string, number>;
    originalWeight.randomisation.forEach((_, index) => {
        // NVG's
        if (!noNvgNeeded &&
            randomisation?.[index]?.equipmentMods?.mod_nvg !== undefined) {
            randomisation[index].equipmentMods.mod_nvg = isNight
                ? (index + 1) * 18
                : 0;
            if (randomisation[index].equipmentMods.mod_nvg > 100)
                randomisation[index].equipmentMods.mod_nvg = 100;
        }
        // Silencers??
        if (randomisation?.[index]?.weaponMods?.mod_muzzle !== undefined) {
            randomisation[index].weaponMods.mod_muzzle += isNight ? 18 : 0;
            if (randomisation[index].weaponMods.mod_muzzle > 100)
                randomisation[index].weaponMods.mod_muzzle = 100;
        }
        // Flashlights
        if (location === "laboratory" ||
            randomisation?.[index]?.weaponMods?.mod_flashlight !== undefined) {
            randomisation[index].weaponMods.mod_flashlight += isNight ? 45 : 0;
            if (randomisation[index].weaponMods.mod_flashlight > 100)
                randomisation[index].weaponMods.mod_flashlight = 100;
        }
        if (location === "laboratory") {
            [
                "mod_equipment",
                "mod_equipment_000",
                "mod_equipment_001",
                "mod_equipment_002", //TODO: check if this is still needed
                "mod_pistol_grip_akms",
                "mod_tactical",
                "mod_tactical_2",
                "mod_tactical001",
                "mod_tactical002",
                "mod_tactical_000",
                "mod_tactical_001",
                "mod_tactical_002",
                "mod_tactical_003",
            ].forEach((modName) => {
                if (randomisation?.[index]?.weaponMods?.[modName] !== undefined) {
                    randomisation[index].weaponMods[modName] += 30;
                    if (randomisation[index].weaponMods[modName] > 100)
                        randomisation[index].weaponMods[modName] = 100;
                }
            });
        }
    });
};
exports.makeRandomisationAdjustments = makeRandomisationAdjustments;
const makeMapSpecificWeaponWeightings = (location, items, originalWeight, pmcWeighting) => {
    const firstPrimaryWeaponTypes = advancedConfig_json_1.default.locations[location].weightingAdjustments.FirstPrimaryWeapon;
    originalWeight.weightingAdjustmentsByBotLevel.forEach((weightTier, index) => {
        const firstPrimary = weightTier.equipment.edit.FirstPrimaryWeapon;
        const firstPrimaryKeys = Object.keys(firstPrimary);
        firstPrimaryKeys?.forEach((weaponId) => {
            const parentId = items[weaponId]?._parent;
            const parent = items?.[parentId]?._name;
            if (parent && firstPrimaryWeaponTypes[parent]) {
                const multiplier = firstPrimaryWeaponTypes[parent];
                pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId] =
                    Math.round(multiplier * firstPrimary[weaponId]);
                // console.log(firstPrimary[weaponId], " to ", pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId], parent, items[weaponId]._name)
            }
            else {
                console.log(`Algorthimic LevelProgression:  Unable to set map settings for ${items[weaponId]._name} - ${weaponId} `);
            }
        });
    });
};
exports.makeMapSpecificWeaponWeightings = makeMapSpecificWeaponWeightings;
const cullModItems = (mods, isNight, items, location) => {
    const cullList = new Set([
        ...(isNight ? nightTimeCullList : dayTimeCullList),
        ...InternalBlacklist_1.default,
    ]);
    if (location === "laboratory") {
        cullList.delete("5a1ead28fcdbcb001912fa9f");
        cullList.delete("5c11046cd174af02a012e42b");
        cullList.delete("5a1eaa87fcdbcb001865f75e");
        cullList.delete("5d1b5e94d7ad1a2b865a96b0");
        cullList.delete("5ea058e01dbce517f324b3e2");
    }
    for (let key in mods) {
        if (cullList.has(key) ||
            !checkDaytimeSilencer(key, isNight, items, cullList)) {
            delete mods[key];
        }
        else {
            for (const modType in mods[key]) {
                if (mods?.[key]?.[modType].length) {
                    mods[key][modType] = mods[key][modType].filter((id) => !cullList.has(id) &&
                        checkDaytimeSilencer(id, isNight, items, cullList));
                    if (mods[key][modType].length === 0 &&
                        Object.keys(mods[key]).length === 1) {
                        delete mods[key];
                    }
                }
            }
        }
    }
};
exports.cullModItems = cullModItems;
const checkDaytimeSilencer = (id, isNight, items, cullList) => {
    const item = items[id];
    if (!item?._props)
        return false;
    switch (true) {
        case !isNight &&
            (0, utils_1.checkParentRecursive)(id, items, [utils_1.muzzleParent]) &&
            item._props.Loudness < GlobalValues_1.globalValues.advancedConfig.daytimeSilencerCutoff:
            // console.log(item._name);
            cullList.add(id);
            return false;
        default:
            break;
    }
    return true;
};
const nightTimeCullList = [
    "5cc9c20cd7f00c001336c65d", // tactical_all_ncstar_tactical_blue_laser
    "560d657b4bdc2da74d8b4572", // tactical_all_zenit_2p_kleh_vis_laser
];
const dayTimeCullList = [
    "5b3b6dc75acfc47a8773fb1e",
    "644a3df63b0b6f03e101e065", // tactical_all_bemeyers_mawl_c1_plus
    "5b3a337e5acfc4704b4a19a0", // tactical_all_zenit_2u_kleh
    "626becf9582c3e319310b837", // tactical_all_insight_wmx200
    "57fd23e32459772d0805bcf1", // tactical_all_holosun_ls321
    "544909bb4bdc2d6f028b4577", // tactical_all_insight_anpeq15
];
const smgUpperRails = new Set([
    "5926dad986f7741f82604363",
    "5a966ec8a2750c00171b3f36",
    "602e63fb6335467b0c5ac94d",
    "5894a5b586f77426d2590767",
    "5de8e67c4a9f347bc92edbd7",
]);
const marksmanUpperRails = new Set([
    "5df8e4080b92095fd441e594",
    "5dfcd0e547101c39625f66f9",
]);
const updateScopes = (mods, isNight, items, location) => {
    const weaponTypeMapper = buildOutWeaponTypeMapper(location, isNight);
    for (let key in mods) {
        if (smgUpperRails.has(key) ||
            marksmanUpperRails.has(key) ||
            (0, utils_1.checkParentRecursive)(key, items, [utils_1.weaponParent])) {
            const parent = items[key]._parent;
            let scopeTypes = weaponTypeMapper[parent];
            if (smgUpperRails.has(key)) {
                scopeTypes = weaponTypeMapper[utils_1.weaponTypeNameToId.Smg];
            }
            if (marksmanUpperRails.has(key)) {
                scopeTypes = weaponTypeMapper[utils_1.weaponTypeNameToId.MarksmanRifle];
            }
            if (!scopeTypes) {
                // console.log("UNABLE TO FIND PARENT FOR", key, items[key]._name)
                break;
            }
            if (!!mods[key]?.mod_scope?.length) {
                const result = mods[key].mod_scope.filter((id) => scopeTypes.has(items[id]?._parent) ||
                    checkIfChildHasScopes(id, items, scopeTypes, mods));
                if (result.length)
                    mods[key].mod_scope = result;
            }
            if (!!mods[key]?.mod_mount) {
                const mountResult = mods[key].mod_mount.filter((id) => scopeTypes.has(items[id]?._parent) ||
                    checkIfChildHasScopes(id, items, scopeTypes, mods, true));
                // console.log(key, items[key]._name, mods[key].mod_mount.length, mountResult.length)
                if (mountResult.length)
                    mods[key].mod_mount = mountResult;
                mods[key]?.mod_mount;
            }
            [
                "mod_mount_001",
                "mod_mount_002",
                "mod_mount_003",
                "mod_mount_004",
            ].forEach((mountType) => {
                if (!!mods[key]?.[mountType]) {
                    const mountResult = mods[key][mountType].filter((id) => !(0, utils_1.checkParentRecursive)(id, items, [utils_1.mountParent, utils_1.sightParent]) ||
                        (items[id]?._parent === utils_1.mountParent && !mods[id]?.mod_scope) ||
                        scopeTypes.has(items[id]?._parent) ||
                        checkIfChildHasScopes(id, items, scopeTypes, mods, true));
                    // console.log(mountType, key, items[key]._name, mods[key][mountType].length, mountResult.length)
                    if (mountResult.length)
                        mods[key][mountType] = mountResult;
                    mods[key]?.[mountType];
                }
            });
            if (!!mods[key]?.mod_reciever) {
                const receiverScopetypes = checkAssaultScopeTypes(items, key, scopeTypes, weaponTypeMapper);
                const receiverResult = mods[key].mod_reciever.filter((id) => scopeTypes.has(items[id]?._parent) ||
                    checkIfChildHasScopes(id, items, receiverScopetypes, mods, true));
                // console.log(key, items[key]._name, mods[key].mod_reciever.length, receiverResult.length)
                if (receiverResult?.length)
                    mods[key].mod_reciever = receiverResult;
                mods[key]?.mod_reciever;
            }
        }
    }
};
exports.updateScopes = updateScopes;
const akType = "reciever_ak";
const checkAssaultScopeTypes = (items, id, originalScopeType, weaponTypeMapper) => {
    if (items[id]?._name?.includes(akType))
        return weaponTypeMapper["5447b5f14bdc2d61278b4567"]; //assault rifle type
    return originalScopeType;
};
const checkIfChildHasScopes = (id, items, scopeTypes, mods, clean) => {
    const result = !!mods[id]?.mod_scope?.find((scopeId) => scopeTypes.has(items[scopeId]?._parent));
    if (result && clean) {
        const filtered = mods[id]?.mod_scope.filter((id) => scopeTypes.has(items[id]?._parent) ||
            checkIfChildHasScopes(id, items, scopeTypes, mods));
        if (filtered?.length)
            mods[id].mod_scope = filtered;
    }
    return result;
};
const buildOutWeaponTypeMapper = (location, isNight) => {
    const mapper = {};
    const sightConfiguration = (0, utils_1.cloneDeep)(advancedConfig_json_1.default.locations[location].sightConfiguration);
    if (isNight) {
        ["SniperRifle", "MarksmanRifle", "AssaultCarbine", "AssaultRifle"].forEach((type) => {
            sightConfiguration[type].push("NightVision");
        });
    }
    for (const weaponType in sightConfiguration) {
        const weaponTypeUUID = utils_1.weaponTypeNameToId[weaponType];
        mapper[weaponTypeUUID] = new Set(sightConfiguration[weaponType].map((name) => utils_1.SightType[name]));
    }
    return mapper;
};
// check if item is scope, if so ignore (allow for child scopes)
// check if item is weapon, if so, filter mod_scope
// if scope, check
// if "55818b224bdc2dde698b456f" Mount, check if any mod_scope within contain correct scopes, if not remove
//# sourceMappingURL=OnGameStartUtils.js.map