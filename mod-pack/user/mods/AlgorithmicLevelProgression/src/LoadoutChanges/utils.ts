import { ICustomizationItem } from "@spt/models/eft/common/tables/ICustomizationItem";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ISuit } from "@spt/models/eft/common/tables/ITrader";
import {
  EquipmentFilterDetails,
  EquipmentFilters,
  IBotConfig,
  RandomisationDetails,
  WeightingAdjustmentDetails,
} from "@spt/models/spt/config/IBotConfig";

import advancedConfig from "../../config/advancedConfig.json";
import config, { levelRange } from "../../config/config.json";
import { MinMax } from "../../types/models/common/MinMax";
import {
  Appearance,
  Inventory,
  Mods,
} from "../../types/models/eft/common/tables/IBotType";
import InternalBlacklist from "./InternalBlacklist";

export const saveToFile = (data, filePath) => {
  var fs = require("fs");
  let dir = __dirname;
  let dirArray = dir.split("\\");
  const directory = `${dirArray[dirArray.length - 5]}/${
    dirArray[dirArray.length - 4]
  }/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`;
  fs.writeFile(
    directory + filePath,
    JSON.stringify(data, null, 4),
    function (err) {
      if (err) throw err;
    }
  );
};

export const headwearParent = "5a341c4086f77401f2541505";
export const AmmoParent = "5485a8684bdc2da71d8b4567";
export const magParent = "5448bc234bdc2d3c308b4569";
export const barterParent = "5448eb774bdc2d0a728b4567";
export const keyMechanical = "5c99f98d86f7745c314214b3";
export const stimParent = "5448f3a64bdc2d60728b456a";
export const painKillerParent = "5448f3a14bdc2d27728b4569";
export const medicalParent = "5448f3ac4bdc2dce718b4569";
export const medKitParent = "5448f39d4bdc2d0a728b4568";
export const FoodDrinkParent = "543be6674bdc2df1348b4569";
export const medsParent = "543be5664bdc2dd4348b4569";
export const modParent = "5448fe124bdc2da5018b4567";
export const masterMod = "55802f4a4bdc2ddb688b4569";
export const moneyParent = "543be5dd4bdc2deb348b4569";
export const sightParent = "5448fe7a4bdc2d6f028b456b";
export const stockParent = "55818a594bdc2db9688b456a";
export const pistolGripParent = "55818a684bdc2ddd698b456d";
export const muzzleParent = "5448fe394bdc2d0d028b456c";
export const receiverParent = "55818a304bdc2db5418b457d";
export const gasblockParent = "56ea9461d2720b67698b456f";
export const barrelParent = "555ef6e44bdc2de9068b457e";
export const handguardParent = "55818a104bdc2db9688b4569";
export const chargeParent = "55818a104bdc2db9688b4569";
export const mountParent = "55818b224bdc2dde698b456f";
export const weaponParent = "5422acb9af1c889c16000029";
export const armorParent = "57bef4c42459772e8d35a53b";
export const rigParent = "5448e5284bdc2dcb718b4567";
export const armorPlateParent = "644120aa86ffbe10ee032b6f";

export enum SightType {
  AssaultScope = "55818add4bdc2d5b648b456f",
  Collimator = "55818ad54bdc2ddc698b4569",
  CompactCollimator = "55818acf4bdc2dde698b456b",
  OpticScope = "55818ae44bdc2dde698b456c",
  SpecialScope = "55818aeb4bdc2ddc698b456a",
  ThermalVision = "5d21f59b6dbe99052b54ef83",
  NightVision = "5a2c3a9486f774688b05e574",
}

export const weaponTypeNameToId = {
  SniperRifle: "5447b6254bdc2dc3278b4568",
  MarksmanRifle: "5447b6194bdc2d67278b4567",
  AssaultCarbine: "5447b5fc4bdc2d87278b4567",
  AssaultRifle: "5447b5f14bdc2d61278b4567",
  MachineGun: "5447bed64bdc2d97278b4568",
  Smg: "5447b5e04bdc2d62278b4567",
  SpecialWeapon: "5447bee84bdc2dc3278b4569",
  Shotgun: "5447b6094bdc2dc3278b4567",
  Pistol: "5447b5cf4bdc2d65278b4567",
  Revolver: "617f1ef5e8b54b0998387733",
  GrenadeLauncher: "5447bedf4bdc2d87278b4568",
};

export const addToModsObject = (
  mods: { "1": {}; "2": {}; "3": {}; "4": {} },
  _tpl: string,
  items: Record<string, ITemplateItem>,
  loyaltyLevel: number,
  slotId: string = ""
) => {
  switch (true) {
    case checkParentRecursive(_tpl, items, [magParent]):
      if (!mods[loyaltyLevel]?.["mod_magazine"])
        mods[loyaltyLevel]["mod_magazine"] = [];
      mods[loyaltyLevel]["mod_magazine"].push(_tpl);
      break;
    case slotId !== "hideout":
      if (!mods[loyaltyLevel]?.[slotId]) mods[loyaltyLevel][slotId] = [];
      mods[loyaltyLevel][slotId].push(_tpl);
      break;
    // case checkParentRecursive(_tpl, items, Object.values(SightType)):
    //     if (!mods[loyaltyLevel]?.["mod_scope"]) mods[loyaltyLevel]["mod_scope"] = []
    //     mods[loyaltyLevel]["mod_scope"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [pistolGripParent]):
    //     if (!mods[loyaltyLevel]?.["mod_pistol_grip"]) mods[loyaltyLevel]["mod_pistol_grip"] = []
    //     mods[loyaltyLevel]["mod_pistol_grip"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [stockParent]):
    //     if (!mods[loyaltyLevel]?.["mod_stock"]) mods[loyaltyLevel]["mod_stock"] = []
    //     mods[loyaltyLevel]["mod_stock"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [muzzleParent]):
    //     if (!mods[loyaltyLevel]?.["mod_muzzle"]) mods[loyaltyLevel]["mod_muzzle"] = []
    //     mods[loyaltyLevel]["mod_muzzle"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [receiverParent]):
    //     if (!mods[loyaltyLevel]?.["mod_reciever"]) mods[loyaltyLevel]["mod_reciever"] = []
    //     mods[loyaltyLevel]["mod_reciever"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [gasblockParent]):
    //     if (!mods[loyaltyLevel]?.["mod_gas_block"]) mods[loyaltyLevel]["mod_gas_block"] = []
    //     mods[loyaltyLevel]["mod_gas_block"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [barrelParent]):
    //     if (!mods[loyaltyLevel]?.["mod_barrel"]) mods[loyaltyLevel]["mod_barrel"] = []
    //     mods[loyaltyLevel]["mod_barrel"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [handguardParent]):
    //     if (!mods[loyaltyLevel]?.["mod_handguard"]) mods[loyaltyLevel]["mod_handguard"] = []
    //     mods[loyaltyLevel]["mod_handguard"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [chargeParent]):
    //     if (!mods[loyaltyLevel]?.["mod_charge"]) mods[loyaltyLevel]["mod_charge"] = []
    //     mods[loyaltyLevel]["mod_charge"].push(_tpl)
    //     break;
    // case checkParentRecursive(_tpl, items, [mountParent]):
    //     if (!mods[loyaltyLevel]?.["mod_mount"]) mods[loyaltyLevel]["mod_mount"] = []
    //     mods[loyaltyLevel]["mod_mount"].push(_tpl)
    //     break;

    default:
      break;
  }
};

export const addKeysToPockets = (
  traderItems: Set<string>,
  items: Record<string, ITemplateItem>,
  inventory: Inventory
) => {
  traderItems.forEach((id) => {
    if (
      id &&
      items[id]?._parent &&
      checkParentRecursive(id, items, [keyMechanical])
    ) {
      inventory.items.Pockets[id] = 1;
      inventory.items.Backpack[id] = 1;
      inventory.items.TacticalVest[id] = 1;
    }
  });
  // inventory.items.Pockets = deDupeArr(inventory.items.Pockets);
  // inventory.items.Backpack = deDupeArr(inventory.items.Backpack);
  // inventory.items.TacticalVest = deDupeArr(inventory.items.TacticalVest);
};

export const setupMods = (mods: Record<string, Record<string, string[]>>) => {
  Object.keys(mods).forEach((numstr) => {
    const num = Number(numstr);
    Object.keys(mods[num]).forEach((mod) => {
      mods[num][mod] = deDupeArr(mods[num][mod]);
      if (mods[num + 1]) {
        if (!mods[num + 1]?.[mod]) mods[num + 1][mod] = mods[num][mod];
        else {
          mods[num + 1][mod].push(...mods[num][mod]);
        }
      }
    });
  });
};

export const reduceEquipmentChancesTo1 = (inventory: Inventory) => {
  Object.keys(inventory.equipment).forEach((equipType) => {
    Object.keys(inventory.equipment[equipType]).forEach((id) => {
      if (inventory.equipment[equipType][id] !== 0) {
        inventory.equipment[equipType][id] = 1;
      }
    });
  });
};

export const reduceAmmoChancesTo1 = (inventory: Inventory) => {
  Object.keys(inventory.Ammo).forEach((caliber) => {
    Object.keys(inventory.Ammo[caliber]).forEach((id) => {
      if (inventory.Ammo[caliber][id] !== 0) {
        inventory.Ammo[caliber][id] = 1;
      }
    });
  });
};

export const deDupeArr = (arr: any[]) => [...new Set(arr)];

export const checkParentRecursive = (
  parentId: string,
  items: Record<string, ITemplateItem>,
  queryIds: string[]
): boolean => {
  if (queryIds.includes(parentId)) return true;
  if (!items?.[parentId]?._parent) return false;

  return checkParentRecursive(items[parentId]._parent, items, queryIds);
};

export const cloneDeep = (objectToClone: any) =>
  JSON.parse(JSON.stringify(objectToClone));

export const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export const getArmorRating = (
  { _props: { Slots, Weight }, _name, _id }: ITemplateItem,
  items: Record<string, ITemplateItem>
): number => {
  let armorClassWithCoverage = 1;
  if (Slots?.length > 0) {
    Slots.forEach((mod) => {
      const multiplier =
        (mod._props.filters[0]?.armorColliders?.length ||
          mod._props.filters[0]?.armorPlateColliders?.length) * 3;

      if (mod._props.filters[0]?.Plate !== undefined) {
        const plateId =
          mod._props.filters[0].Plate === ""
            ? mod._props.filters[0].Filter[0]
            : mod._props.filters[0].Plate;
        if (plateId) {
          const armorClass = Number(items[plateId]?._props?.armorClass || 0);
          if (armorClass > 0) {
            armorClassWithCoverage += armorClass * multiplier;
            if (armorClass >= 3) armorClassWithCoverage += multiplier;
          }
        }
      }
    });
  }

  // console.log(armorClassWithCoverage, _name, _id);
  return armorClassWithCoverage;
};

export const getAmmoWeighting = ({
  _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount },
  _id,
  _name,
}: ITemplateItem): number => {
  let penBonus = (PenetrationPower - 20) * 10;
  if (penBonus < 0) penBonus = 0;
  const damBonus =
    ProjectileCount > 1 ? Damage * ProjectileCount * 0.1 : Damage;
  let speedBonus = InitialSpeed > 600 ? 10 : 0;
  const rating = Math.round(penBonus + speedBonus + damBonus);
  // if (rating > 20) console.log(rating || 3, _name)

  return rating || 3;
};

export const getHeadwearRating = (
  item: ITemplateItem,
  items: Record<string, ITemplateItem>
) => {
  let rating = getArmorRating(item, items);
  const hasNvg = !!item._props.Slots.find((slot) => slot._name === "mod_nvg");

  if (hasNvg) rating += 2;
  if (item._props?.BlocksEarpiece) rating *= 0.3;
  // console.log(
  //   Math.round(rating * 1.5 - item._props.Weight),
  //   "-",
  //   item._name,
  //   rating,
  //   item._props.Weight,
  //   item._props?.BlocksEarpiece,
  //   hasNvg,
  //   item._id
  // );
  return Math.round(rating * 1.5 - item._props.Weight) || 1;
};

export const getEquipmentType = (
  id: string,
  items: Record<string, ITemplateItem>
) => {
  const equipmentKeys = Object.keys(equipmentIdMapper);
  for (let index = 0; index < equipmentKeys.length; index++) {
    const key = equipmentKeys[index] as
      | keyof typeof equipmentIdMapper
      | undefined;
    if (checkParentRecursive(id, items, equipmentIdMapper[key])) {
      return key;
    }
  }
};

export const getHighestScoringAmmoValue = (
  ammoWeight: Record<string, number>
): number => {
  let highestValue = 1;
  let highestKey = "";
  for (const key in ammoWeight) {
    const value = ammoWeight[key];
    if (value > highestValue) {
      highestValue = value;
      highestKey = key;
    }
  }
  // console.log(highestKey, highestValue)
  return highestValue;
};

export const getWeaponWeighting = (
  {
    _props: {
      Ergonomics,
      BoltAction,
      weapClass,
      weapFireType,
      RecoilForceUp,
      ReloadMode,
    } = {},
    _name,
    _id,
  }: ITemplateItem,
  highestScoringAmmo: number
): number => {
  let ammo = highestScoringAmmo;
  let gun = Ergonomics;
  if (_id === "5bfd297f0db834001a669119") ammo * 0.7; //Make mosin infantry less desirable
  if (weapFireType.length === 1 && weapFireType.includes("single"))
    ammo = ammo * 0.8;
  if (ReloadMode.includes("OnlyBarrel")) ammo = ammo / 4;
  if (RecoilForceUp > 200) ammo = ammo * 0.8;
  if (BoltAction) ammo = ammo / 2;
  if (weapFireType.includes("fullauto")) ammo = ammo * 1.2;
  if (weapClass !== "pistol" && RecoilForceUp < 100) ammo * 1.2;
  if (
    new Set(["64ca3d3954fc657e230529cc", "64637076203536ad5600c990"]).has(_id)
  ) {
    gun *= 0.5;
  }
  const finalValue = Math.round(gun + ammo);
  // if (finalValue > 5) console.log(finalValue > 0 ? finalValue : 1, Math.round(ammo), Math.round(gun), _name, weapClass)
  return finalValue > 1 ? finalValue : 1;
};

export const getBackPackInternalGridValue = ({
  _props: { Grids, Weight } = {},
  _name,
  _id,
}: ITemplateItem): number => {
  let total = 0;
  Grids.forEach(({ _props }) => {
    total += _props?.cellsH * _props?.cellsV;
    // if the backpack can't hold "Items" give it a severe lower ranking
    if (
      _props.filters?.[0]?.Filter?.length &&
      !_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")
    ) {
      total = total / 6;
    }
  });
  if (total > 20) total += 20;

  total = Math.round(total / Weight);
  if (["6034d103ca006d2dca39b3f0", "6038d614d10cbf667352dd44"].includes(_id)) {
    total = Math.round(total * 0.7);
  }
  return total > 1 ? total : 1;
};

export const getTacticalVestValue = (
  item: ITemplateItem,
  items: Record<string, ITemplateItem>
): number => {
  const { Grids } = item._props;
  let spaceTotal = 0;
  Grids.forEach(({ _props }) => {
    spaceTotal += _props?.cellsH * _props?.cellsV;
  });
  if (spaceTotal > 12) spaceTotal += 20;
  spaceTotal = Math.round(spaceTotal - item._props.Weight);
  const armorRating = getArmorRating(item, items) * 0.8;
  // console.log(
  //   Math.round(
  //     armorRating > spaceTotal ? armorRating + spaceTotal : spaceTotal * 2
  //   ),
  //   armorRating > spaceTotal ? "armor" : "vest",
  //   item._name,
  //   item._id
  // );
  return Math.round(
    armorRating > spaceTotal ? armorRating + spaceTotal : spaceTotal * 2
  );
};

export const equipmentIdMapper = {
  Headwear: [headwearParent],
  Earpiece: ["5645bcb74bdc2ded0b8b4578"],
  FaceCover: ["5a341c4686f77469e155819e"],
  Eyewear: ["5448e5724bdc2ddf718b4568"],
  ArmBand: ["5b3f15d486f77432d0509248"],
  ArmorVest: ["5448e54d4bdc2dcc718b4568"],
  TacticalVest: ["5448e5284bdc2dcb718b4567"],
  Pockets: ["557596e64bdc2dc2118b4571"],
  Backpack: ["5448e53e4bdc2d60728b4567"],
  FirstPrimaryWeapon: [
    "5447b5fc4bdc2d87278b4567",
    "5447b5f14bdc2d61278b4567",
    "5447bedf4bdc2d87278b4568",
    "5447bed64bdc2d97278b4568",
    "5447b6194bdc2d67278b4567",
    "5447b6094bdc2dc3278b4567",
    "5447b5e04bdc2d62278b4567",
    "5447b6254bdc2dc3278b4568",
    "5447bee84bdc2dc3278b4569",
  ],
  // SecondPrimaryWeapon: [],
  Holster: ["617f1ef5e8b54b0998387733", "5447b5cf4bdc2d65278b4567"],
  Scabbard: ["5447e1d04bdc2dff2f8b4567"],
  // mod_magazine: [
  //     "5448bc234bdc2d3c308b4569",
  //     "610720f290b75a49ff2e5e25"
  // ],
  // // Stock: ["55818a594bdc2db9688b456a"],
  // mod_scope: [...Object.values(SightType)],
};

export type oneToFive = "1" | "2" | "3" | "4" | "5";

export const getCurrentLevelRange = (
  currentLevel: number
): oneToFive | undefined => {
  for (const key in levelRange) {
    const { min, max } = levelRange[key] as MinMax;
    if (currentLevel >= min && currentLevel <= max) return key as oneToFive;
  }
};

export const numList = [1, 2, 3, 4, 5];

export const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const setupBaseWhiteList = (): EquipmentFilterDetails[] => {
  return numList.map((num) => ({
    levelRange: levelRange[num],
    equipment: {},
    cartridge: {},
  }));
};

export type TradersMasterList = {
  1: Set<string>;
  2: Set<string>;
  3: Set<string>;
  4: Set<string>;
  5: Set<string>;
};

export const setWhitelists = (
  items: Record<string, ITemplateItem>,
  botConfig: IBotConfig,
  tradersMasterList: TradersMasterList,
  mods: Record<string, Record<string, string[]>>
) => {
  numList.forEach((num, index) => {
    const loyalty = num;
    const whitelist = botConfig.equipment.pmc.whitelist;
    const itemList = [...tradersMasterList[loyalty]];

    whitelist[index].equipment = {
      ...whitelist[index].equipment,
      ...mods[num],
    };

    itemList.forEach((id) => {
      const item = items[id];
      const parent = item._parent;
      const equipmentType = getEquipmentType(parent, items);

      switch (true) {
        // Check if revolver shotgun
        case id === "60db29ce99594040e04c4a27":
          whitelist[index].equipment["FirstPrimaryWeapon"] = [
            ...(whitelist[index].equipment["FirstPrimaryWeapon"]
              ? whitelist[index].equipment["FirstPrimaryWeapon"]
              : []),
            id,
          ];
          break;
        // Check if sawed-off shotgun
        case id === "64748cb8de82c85eaf0a273a":
          whitelist[index].equipment["Holster"] = [
            ...(whitelist[index].equipment["Holster"]
              ? whitelist[index].equipment["Holster"]
              : []),
            id,
          ];
          break;
        case !!equipmentType:
          whitelist[index].equipment[equipmentType] = [
            ...(whitelist[index].equipment[equipmentType]
              ? whitelist[index].equipment[equipmentType]
              : []),
            id,
          ];
          break;
        default:
          break;
      }
    });

    if (!!whitelist[index + 1]) {
      whitelist[index + 1].equipment = cloneDeep(whitelist[index].equipment);
    }
  });
  // console.log(JSON.stringify(botConfig.equipment.pmc.whitelist))
};

export const buildEmptyWeightAdjustments = (): WeightingAdjustmentDetails[] => {
  return numList.map((num) => ({
    levelRange: levelRange[num],
    ammo: {
      add: {},
      edit: {},
    },
    equipment: {
      add: {},
      edit: {},
    },
    clothing: {
      add: {},
      edit: {},
    },
  }));
};

const multiplyAndRound = (num1: number, num2: number): number =>
  Math.round(num1 * num2);

const setWeightItem = (
  weight: WeightingAdjustmentDetails,
  equipmentType: string,
  id: string,
  rating: number,
  tierMultiplier: number
) => {
  // if (add) {
  //     weight.equipment.add[equipmentType] = {
  //         ...weight.equipment.add[equipmentType] || {},
  //         [id]: rating
  //     }
  // } else {
  weight.equipment.edit[equipmentType] = {
    ...(weight.equipment.edit[equipmentType] || {}),
    [id]: multiplyAndRound(rating, tierMultiplier) || 1,
  };
  // }
};

export const setWeightingAdjustments = (
  items: Record<string, ITemplateItem>,
  botConfig: IBotConfig,
  tradersMasterList: TradersMasterList,
  mods: Record<string, Record<string, string[]>>
) => {
  const weight = botConfig.equipment.pmc.weightingAdjustmentsByBotLevel;

  const itemsForNextLevel = {};

  numList.forEach((num, index) => {
    const loyalty = num;
    const itemList = [...tradersMasterList[loyalty]];
    const finalList = [
      ...new Set([
        ...(advancedConfig.forbiddenBullets[num] || []),
        ...(itemsForNextLevel[num] || []),
        ...itemList,
      ]),
    ];

    // First edit ammo
    finalList.forEach((id) => {
      if (num < 4 && combinedForbiddenBullets.has(id)) return; //console.log(num, items[id]._name, id)
      const item = items[id];
      const parent = item._parent;
      // Ammo Parent
      if (checkParentRecursive(parent, items, [AmmoParent])) {
        const calibre = item._props.Caliber || item._props.ammoCaliber;
        if (num + 1 < 6) {
          if (!itemsForNextLevel[num + 1])
            itemsForNextLevel[num + 1] = new Set([]);
          itemsForNextLevel[num + 1].add(id);
        }
        if (!weight[index]?.ammo.edit?.[calibre]) {
          weight[index].ammo.edit = {
            ...weight[index].ammo.edit,
            [calibre]: {},
          };
        }

        const ammoWeight = getAmmoWeighting(item);

        weight[index].ammo.edit[calibre] = {
          ...(weight[index].ammo.edit[calibre] || {}),
          [id]: ammoWeight,
        };
      }
    });
  });

  //Make bad ammos worse, better ones better
  numList.forEach((num, index) => {
    Object.keys(weight[index].ammo.edit).forEach((caliber) => {
      const caliberList = Object.keys(weight[index].ammo.edit[caliber]).sort(
        (a, b) =>
          weight[index].ammo.edit[caliber][b] -
          weight[index].ammo.edit[caliber][a]
      );
      caliberList.forEach((id, rank) => {
        if (caliberList.length > 1 && rank > 0) {
          if (rank > 3) weight[index].ammo.edit[caliber][id] = 5;
          const modifier = (caliberList.length - rank) / caliberList.length;
          weight[index].ammo.edit[caliber][id] =
            Math.round(weight[index].ammo.edit[caliber][id] * modifier) || 5;
          if (weight[index].ammo.edit[caliber][id] === 1)
            weight[index].ammo.edit[caliber][id] = 5;
        }
      });
    });
    // console.log(JSON.stringify(weight[index].ammo.edit))
  });

  //Make best ammos have a chance of use at lower level
  weight.reverse().forEach((currentItem, index) => {
    const nextItem = weight?.[index + 1];
    if (nextItem) {
      Object.keys(nextItem.ammo.edit).forEach((caliber) => {
        if (currentItem.ammo.edit[caliber]) {
          const max = Math.max(...Object.values(nextItem.ammo.edit[caliber]));
          const maxValueForHighTier = Math.round(
            config.higherTierAmmoChance * max
          );

          const nextAmmoIdList = new Set(
            Object.keys(nextItem.ammo.edit[caliber] || {})
          );

          const currentTierItemList = Object.keys(
            currentItem.ammo.edit[caliber]
          )
            .filter(
              (id) =>
                !nextAmmoIdList.has(id) &&
                currentItem.ammo.edit[caliber][id] > maxValueForHighTier
            )
            .sort(
              (a, b) =>
                currentItem.ammo.edit[caliber][b] -
                currentItem.ammo.edit[caliber][a]
            );

          currentTierItemList.forEach((id, rank) => {
            weight[index + 1].ammo.edit[caliber][id] = Math.round(
              maxValueForHighTier / (currentTierItemList.length - rank)
            );
          });
        }
      });
    }
  });

  weight.reverse();

  // Apply randomness
  weight.forEach(({ ammo }, index) => {
    Object.keys(ammo.edit).forEach((calbr) => {
      const list = weight[index].ammo.edit[calbr];
      const keys = Object.keys(list);
      const sortedValues = Object.values(list).sort((a, b) => a - b);
      const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
      const medianValue = sortedValues[middleIndex];
      const highestValue = sortedValues[sortedValues.length - 1];
      const lowestValue = sortedValues[0];
      const betterValue = Math.round(
        (medianValue + highestValue + lowestValue) / 3
      );

      if (betterValue >= 1) {
        keys.forEach((key) => {
          const valToAdjust = list[key];
          if (valToAdjust > 5) {
            const adjustedAmountMax = betterValue - valToAdjust;
            const amountAfterAdjustment = Math.round(
              valToAdjust + adjustedAmountMax * config.randomness.Ammo
            );
            if (weight[index].ammo.edit[calbr][key]) {
              weight[index].ammo.edit[calbr][key] = Math.abs(
                amountAfterAdjustment
              );
            }
          }
        });
      }
    });
  });

  // saveToFile(weight, "refDBS/weight1.json"); //------------------------------------------------------------------------------

  // for (const category in weight.ammo.edit) {
  //   const randomnessMultiplier = config?.randomness?.[category];
  //   if (!randomnessMultiplier) return;
  //   const list = weight[index].equipment.edit[category];
  //   const keys = Object.keys(list);
  //   const sortedValues = Object.values(list).sort((a, b) => a - b);
  //   const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
  //   const medianValue = sortedValues[middleIndex];
  //   const highestValue = sortedValues[sortedValues.length - 1];
  //   const lowestValue = sortedValues[0];
  //   const betterValue = Math.round(
  //     (medianValue + highestValue + lowestValue) / 3
  //   );

  //   if (betterValue > 1) {
  //     keys.forEach((key) => {
  //       const valToAdjust = list[key];
  //       if (valToAdjust > 5) {
  //         const adjustedAmountMax = betterValue - valToAdjust;
  //         const amountAfterAdjustment = Math.round(
  //           valToAdjust + adjustedAmountMax * randomnessMultiplier
  //         );
  //         if (weight[index].equipment.edit[category][key]) {
  //           weight[index].equipment.edit[category][key] = Math.abs(
  //             amountAfterAdjustment
  //           );
  //         }
  //       }
  //     });
  //   }
  // }

  // saveToFile(weight, "refDBS/weight1.json");
  //------------------------------------------------------------------------------

  numList.forEach((actualNum, index) => {
    numList.forEach((num) => {
      if (num > actualNum) return;
      const itemList = [...tradersMasterList[num]];

      itemList.forEach((id) => {
        const item = items[id];
        const parent = item._parent;
        const equipmentType = getEquipmentType(parent, items);

        const itemIsArmor = Number(item._props.armorClass) > 0;

        const isLowList = actualNum - num >= (itemIsArmor ? 1 : 3);
        const tierMultiplier = isLowList ? 0 : num / actualNum;

        if (equipmentType) {
          if (!weight[index]?.equipment?.edit?.[equipmentType]) {
            weight[index].equipment.edit = {
              ...weight[index].equipment.edit,
              [equipmentType]: {},
            };
          }
        }

        switch (equipmentType) {
          case "FirstPrimaryWeapon":
          case "Holster":
            if (num + 1 < 6) {
              if (!itemsForNextLevel[num + 1])
                itemsForNextLevel[num + 1] = new Set([]);
              itemsForNextLevel[num + 1].add(id);
            }

            const calibre = item._props.Caliber || item._props.ammoCaliber;
            const highestScoringAmmo = getHighestScoringAmmoValue(
              weight[index].ammo.edit[calibre]
            );
            const weaponRating = getWeaponWeighting(item, highestScoringAmmo);

            switch (id) {
              // Check if revolver shotgun
              case "60db29ce99594040e04c4a27":
                setWeightItem(
                  weight[index],
                  "FirstPrimaryWeapon",
                  id,
                  weaponRating,
                  tierMultiplier
                );
                break;
              // Check if sawed-off shotgun
              case "64748cb8de82c85eaf0a273a":
                setWeightItem(
                  weight[index],
                  "Holster",
                  id,
                  weaponRating,
                  tierMultiplier
                );
                break;
              default:
                setWeightItem(
                  weight[index],
                  equipmentType,
                  id,
                  weaponRating,
                  tierMultiplier
                );
                break;
            }
            break;
          case "Headwear":
            const rating = getHeadwearRating(item, items);

            setWeightItem(
              weight[index],
              equipmentType,
              id,
              Math.round(rating),
              tierMultiplier
            );
            break;
          case "Earpiece":
            const ambientVolumeBonus = item?._props?.AmbientVolume * -1;
            const compressorBonus = item?._props?.CompressorVolume * -0.5;
            setWeightItem(
              weight[index],
              equipmentType,
              id,
              Math.round(compressorBonus + ambientVolumeBonus),
              tierMultiplier
            );
            break;
          case "FaceCover":
            setWeightItem(
              weight[index],
              equipmentType,
              id,
              item._props.BlocksHeadwear ? 1 : 40,
              tierMultiplier
            );
            break;
          case "ArmorVest":
            const armorRating = getArmorRating(item, items);
            setWeightItem(
              weight[index],
              equipmentType,
              id,
              armorRating,
              tierMultiplier
            );
            break;
          case "ArmBand":
            setWeightItem(weight[index], equipmentType, id, 20, tierMultiplier);
            break;
          case "Scabbard":
            setWeightItem(weight[index], equipmentType, id, 20, tierMultiplier);
            break;
          case "Eyewear":
            setWeightItem(
              weight[index],
              equipmentType,
              id,
              Math.round(
                item._props.LootExperience + item._props.BlindnessProtection * 5
              ) || 3,
              tierMultiplier
            );
            break;
          case "Backpack":
            const backpackInternalGridValue =
              getBackPackInternalGridValue(item);
            setWeightItem(
              weight[index],
              equipmentType,
              id,
              backpackInternalGridValue,
              tierMultiplier
            );
            break;
          case "TacticalVest":
            const tacticalVestWeighting = getTacticalVestValue(item, items);

            setWeightItem(
              weight[index],
              equipmentType,
              id,
              tacticalVestWeighting,
              tierMultiplier
            );
            break;
          default:
            // switch (true) {
            //   case checkParentRecursive(id, items, [medsParent]):
            //     setWeightItem(
            //       weight[index],
            //       "SecuredContainer",
            //       id,
            //       num * 10,
            //       tierMultiplier
            //     );
            //     break;

            //   default:
            //     break;
            // }
            break;
        }
      });
    });

    for (const category in weight[index].equipment.edit) {
      const randomnessMultiplier = config?.randomness?.[category];
      if (!randomnessMultiplier) return;
      const list = weight[index].equipment.edit[category];
      const keys = Object.keys(list);
      const sortedValues = Object.values(list).sort((a, b) => a - b);
      const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
      const medianValue = sortedValues[middleIndex];
      const highestValue = sortedValues[sortedValues.length - 1];
      const lowestValue = sortedValues[0];
      const betterValue = Math.round(
        (medianValue + highestValue + lowestValue) / 3
      );

      if (betterValue > 1) {
        keys.forEach((key) => {
          const valToAdjust = list[key];
          if (valToAdjust > 5) {
            const adjustedAmountMax = betterValue - valToAdjust;
            const amountAfterAdjustment = Math.round(
              valToAdjust + adjustedAmountMax * randomnessMultiplier
            );
            if (weight[index].equipment.edit[category][key]) {
              weight[index].equipment.edit[category][key] = Math.abs(
                amountAfterAdjustment
              );
            }
          }
        });
      }
    }
  });

  // const list: { [key: string]: string[] } = {}
  // tradersMasterList[5].forEach(id => {
  //     const parent = items[id]?._parent
  //     if (!parent) return
  //     const equipmentType = getEquipmentType(parent, items)
  //     if (equipmentType) {
  //         if (!list?.[equipmentType]) list[equipmentType] = []
  //         list[equipmentType].push(id)
  //     } else if (checkParentRecursive(parent, items, [AmmoParent])) {
  //         if (!list?.["ammo"]) list["ammo"] = []
  //         list.ammo.push(id)
  //     }
  // })
  // saveToFile({ list }, "refDBS/tier5.json")
};

export const addAllMedsToInventory = (
  traderList: Set<string>,
  inventory: Inventory,
  items: Record<string, ITemplateItem>
) => {
  traderList.forEach((id) => {
    if (checkParentRecursive(id, items, [medsParent])) {
      if (
        inventory.equipment.SecuredContainer?.[id] ||
        inventory.equipment.SecuredContainer[id] !== 1
      ) {
        // console.log(items[id]._name);
        inventory.equipment.SecuredContainer[id] = 1;
      }
    }
  });
};

export const combineWhitelist = (equipmentFilters: EquipmentFilters) => {
  const combinedWhitelist = {
    levelRange: {
      min: 1,
      max: 99,
    },
    equipment: {},
    cartridge: {},
  };

  equipmentFilters.whitelist.forEach((list, index) => {
    for (const key in list) {
      if (key !== "levelRange") {
        for (const subKey in list[key]) {
          const value = equipmentFilters.whitelist[index]?.[key]?.[subKey];
          if (value) {
            combinedWhitelist[key][subKey] = deDupeArr([
              ...(!!combinedWhitelist[key][subKey]
                ? combinedWhitelist[key][subKey]
                : []),
              ...value,
            ]);
          }
        }
      }
    }
  });
  equipmentFilters.whitelist = [combinedWhitelist];
  // saveToFile(equipmentFilters.whitelist, "refDBS/equipmentFilters.json");
};

const addRecursive = (
  modId: string,
  items: Record<string, ITemplateItem>,
  weaponId: string,
  mods: Mods,
  count = 0
) => {
  if (count > 115) return false;
  const newModObject = {};
  let pass = false;
  if (items[modId]?._props?.Slots?.length > 0) {
    items[modId]._props.Slots.forEach((mod) => {
      if (mod._props?.filters?.[0]?.Filter?.length) {
        newModObject[mod._name] = mod._props.filters[0].Filter.filter((id) => {
          if (blacklistedItems.has(id)) return false;
          count += 1;
          addRecursive(id, items, weaponId, mods, count);
          return true;
        });
        pass = true;
      }
    });
  }

  if (pass && Object.keys(newModObject).length) {
    mods[modId] = newModObject;
  }
};

export const buildOutModsObject = (
  traderList: Set<string>,
  items: Record<string, ITemplateItem>,
  inventory: Inventory,
  botConfig: IBotConfig
) => {
  traderList.forEach((id) => {
    const item = items[id];
    const newModObject = {} as Record<string, string[]>;
    if (
      !blacklistedItems.has(id) &&
      checkParentRecursive(item._parent, items, [
        magParent,
        weaponParent,
        headwearParent,
        armorParent,
        rigParent,
      ])
    ) {
      switch (true) {
        case checkParentRecursive(item._parent, items, [magParent]):
          // if (item?._props?.Height * item?._props?.Width < 3) {
          const bulletList =
            item?._props?.Cartridges?.[0]?._props?.filters?.[0]?.Filter.filter(
              (_tpl) => !!_tpl && !blacklistedItems.has(_tpl)
            );
          if (bulletList) {
            newModObject["cartridges"] = bulletList;
            inventory.mods[id] = newModObject;
          }
          // } else {
          // config.debug &&
          // console.warn(
          //   id,
          //   item._name,
          //   item?._props?.Cartridges?.[0]?._max_count
          // );
          // }
          break;
        case checkParentRecursive(item._parent, items, [weaponParent]): //Weapon
          if (item?._props?.Slots?.length > 0) {
            item._props.Slots.forEach((mod) => {
              //     newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => !!_tpl && !blacklistedItems.has(_tpl) && checkForScopeTypeRecursive(_tpl, items, id, inventory.mods))
              // } else
              if (mod._props?.filters?.[0]?.Filter?.length) {
                newModObject[mod._name] = mod._props.filters[0].Filter.filter(
                  (_tpl) => {
                    if (!!_tpl && !blacklistedItems.has(_tpl)) {
                      addRecursive(_tpl, items, id, inventory.mods);
                      return true;
                    }
                    return false;
                  }
                );
              }
            });
          }
          if (
            item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
            item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length
          ) {
            newModObject["patron_in_weapon"] =
              item._props.Chambers[0]._props?.filters[0].Filter.filter(
                (_tpl) => !!_tpl && !blacklistedItems.has(_tpl)
              );
          }
          if (Object.keys(newModObject)) {
            inventory.mods[id] = newModObject;
          }
          break;
        case checkParentRecursive(item._parent, items, [
          armorParent,
          rigParent,
          headwearParent,
        ]): //armor/vest
          if (item?._props?.Slots?.length > 0) {
            const newModObject = {};
            item._props.Slots.forEach((mod) => {
              newModObject[mod._name] = mod._props.filters[0].Filter.filter(
                (_tpl) => {
                  addRecursive(_tpl, items, id, inventory.mods);
                  return !!_tpl && !blacklistedItems.has(_tpl);
                }
              );
              // }
            });
            inventory.mods[id] = newModObject;
          }
          break;
        default:
          // console.log(items[item._parent]._name, id)
          break;
      }
    }
  });

  traderList.forEach((id) => {
    const item = items[id];
    const newModObject = {} as Record<string, string[]>;

    if (
      !inventory.mods[id] &&
      !blacklistedItems.has(id) &&
      checkParentRecursive(item._parent, items, [modParent])
    ) {
      if (item?._props?.Slots?.length > 0) {
        item._props.Slots.forEach((mod) => {
          if (mod._props?.filters?.[0]?.Filter?.length) {
            switch (true) {
              case mod._name?.includes("scope") &&
                checkParentRecursive(item._parent, items, [
                  handguardParent,
                  gasblockParent,
                ]) /*gasblockParent,*/:
                newModObject[mod._name] = [];
                break;
              // case mod._name?.includes("scope"):
              //     newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => siteWhiteList["5447bedf4bdc2d87278b4568"].includes(_tpl))
              // console.log(item._name, newModObject[mod._name])
              default:
                newModObject[mod._name] = mod._props?.filters[0].Filter.filter(
                  (_tpl) => !blacklistedItems.has(_tpl)
                );
                break;
            }
          }
        });
        if (Object.keys(newModObject)) {
          inventory.mods[id] = newModObject;
        }
      }
    }
  });
  // console.log(JSON.stringify(inventory.mods))
};

export const buildInitialRandomization = (
  items: Record<string, ITemplateItem>,
  botConfig: IBotConfig,
  traderList: TradersMasterList,
  lootingBotsDetected: boolean
) => {
  const randomizationItems: RandomisationDetails[] = [];
  numList.forEach((num, index) => {
    const range = levelRange[num];

    const newItem = {
      levelRange: range,
      equipment: {
        Headwear: [75, 85, 99, 99, 99][index],
        Earpiece: [55, 75, 95, 100, 100][index],
        FaceCover: [25, 35, 65, 75, 90][index],
        ArmorVest: [99, 99, 99, 99, 99][index],
        ArmBand: [25, 45, 59, 69, 80][index],
        TacticalVest: [96, 96, 99, 99, 99][index],
        Pockets: [25, 45, 59, 69, 80][index],
        SecondPrimaryWeapon: [0, 0, 0, 0, 5][index],
        SecuredContainer: 100,
        Scabbard: [1, 5, 5, 10, 40][index],
        FirstPrimaryWeapon: [85, 98, 99, 99, 99][index],
        Holster: [1, 5, 10, 10, 25][index],
        Eyewear: [15, 25, 40, 60, 75][index],
        Backpack: [70, 85, 90, 99, 99][index],
      },
      generation: {
        stims: {
          weights: [
            {
              "0": 5,
              "1": 1,
            },
            {
              "0": 3,
              "1": 1,
            },
            {
              "0": 2,
              "1": 1,
            },
            {
              "0": 6,
              "1": 5,
              "2": 1,
            },
            {
              "0": 5,
              "1": 5,
              "2": 1,
            },
          ][index],
          whitelist: {
            ...(randomizationItems[index - 1]?.generation.stims.whitelist ||
              {}),
          },
        },
        drugs: {
          weights: [
            {
              "0": 1,
              "1": 3,
            },
            {
              "0": 1,
              "1": 4,
            },
            {
              "0": 1,
              "1": 5,
            },
            {
              "0": 0,
              "1": 5,
              "2": 1,
            },
            {
              "0": 0,
              "1": 3,
              "2": 1,
            },
          ][index],
          whitelist: {
            ...(randomizationItems[index - 1]?.generation.drugs.whitelist ||
              {}),
          },
        },
        healing: {
          weights: [
            {
              "0": 1,
              "1": 6,
            },
            {
              "0": 1,
              "1": 8,
            },
            {
              "0": 1,
              "1": 12,
            },
            {
              "0": 1,
              "1": 25,
              "2": 5,
            },
            {
              "0": 0,
              "1": 3,
              "2": 1,
            },
          ][index],
          whitelist: {
            ...(randomizationItems[index - 1]?.generation.healing.whitelist ||
              {}),
          },
        },
        grenades: {
          weights: [
            {
              "0": 1,
              "1": 1,
            },
            {
              "0": 2,
              "1": 2,
              "2": 1,
            },
            {
              "0": 1,
              "1": 2,
              "2": 1,
            },
            {
              "0": 1,
              "1": 2,
              "2": 2,
            },
            {
              "0": 0,
              "1": 2,
              "2": 2,
              "3": 1,
            },
          ][index],
          whitelist: {
            ...(randomizationItems[index - 1]?.generation.grenades.whitelist ||
              {}),
          },
        },
        backpackLoot: {
          weights: lootingBotsDetected
            ? {
                "0": 1,
              }
            : [
                {
                  "0": 1,
                  "1": 2,
                  "2": 2,
                  "3": 1,
                  "4": 1,
                },
                {
                  "0": 1,
                  "1": 1,
                  "2": 2,
                  "3": 2,
                  "4": 2,
                  "5": 1,
                },
                {
                  "0": 0,
                  "1": 1,
                  "2": 1,
                  "3": 1,
                  "4": 2,
                  "5": 2,
                  "6": 1,
                  "7": 1,
                },
                {
                  "0": 0,
                  "1": 0,
                  "2": 1,
                  "3": 1,
                  "4": 3,
                  "5": 2,
                  "6": 2,
                  "7": 1,
                },
                {
                  "0": 0,
                  "1": 0,
                  "2": 0,
                  "3": 0,
                  "4": 1,
                  "5": 1,
                  "6": 3,
                  "7": 2,
                  "8": 2,
                },
              ][index],
          whitelist: {},
        },
        pocketLoot: {
          weights: lootingBotsDetected
            ? {
                "0": 1,
              }
            : [
                {
                  "0": 4,
                  "1": 1,
                  "2": 1,
                },
                {
                  "0": 3,
                  "1": 2,
                  "2": 1,
                },
                {
                  "0": 2,
                  "1": 2,
                  "2": 1,
                  "3": 1,
                },
                {
                  "0": 1,
                  "1": 2,
                  "2": 1,
                  "3": 1,
                },
                {
                  "0": 1,
                  "1": 1,
                  "2": 2,
                  "3": 1,
                },
              ][index],
          whitelist: {},
        },
        vestLoot: {
          weights: lootingBotsDetected
            ? {
                "0": 1,
              }
            : [
                {
                  "0": 3,
                  "1": 1,
                  "2": 1,
                },
                {
                  "0": 2,
                  "1": 2,
                  "2": 1,
                  "4": 1,
                },
                {
                  "0": 1,
                  "1": 1,
                  "2": 2,
                  "3": 2,
                  "5": 2,
                },
                {
                  "0": 1,
                  "1": 1,
                  "2": 1,
                  "3": 2,
                  "4": 2,
                  "5": 2,
                },
                {
                  "0": 0,
                  "1": 2,
                  "3": 2,
                  "4": 1,
                  "5": 1,
                },
              ][index],
          whitelist: {},
        },
        magazines: {
          weights: [
            {
              "0": 0,
              "1": 1,
              "2": 1,
            },
            {
              "0": 0,
              "1": 1,
              "2": 1,
            },
            {
              "0": 0,
              "1": 0,
              "2": 1,
              "3": 1,
            },
            {
              "0": 0,
              "1": 0,
              "2": 1,
              "3": 1,
            },
            {
              "0": 0,
              "1": 0,
              "2": 1,
              "3": 1,
            },
          ][index],
          whitelist: botConfig.equipment.pmc?.whitelist[index]?.equipment
            ?.mod_magazine
            ? (() => {
                const result = {};
                botConfig.equipment.pmc.whitelist[
                  index
                ]?.equipment?.mod_magazine.forEach((item) => {
                  result[item] = 1;
                });
                return result;
              })()
            : {},
        },
      },
      randomisedWeaponModSlots: [],
      weaponMods: {
        mod_barrel: [5, 20, 35, 55, 65][index],
        mod_bipod: [1, 10, 5, 11, 50][index],
        mod_flashlight: [5, 35, 65, 80, 90][index],
        mod_foregrip: [10, 40, 70, 90, 95][index],
        mod_handguard: [5, 40, 70, 90, 95][index],
        mod_launcher: [0, 0, 5, 15, 50][index],
        mod_magazine: [50, 60, 80, 90, 95][index],
        mod_magazine_000: [0, 0, 25, 75, 90][index],
        mod_mount: [75, 95, 100, 100, 100][index],
        mod_mount_000: [20, 45, 75, 90, 95][index],
        mod_mount_001: [20, 45, 75, 90, 95][index],
        mod_mount_002: [20, 45, 75, 90, 95][index],
        mod_mount_003: [20, 45, 75, 90, 95][index],
        mod_mount_004: [20, 45, 75, 90, 95][index],
        mod_mount_005: [20, 45, 75, 90, 95][index],
        mod_mount_006: [20, 45, 75, 90, 95][index],
        mod_muzzle: [5, 15, 35, 70, 100][index],
        mod_muzzle_000: [5, 15, 55, 100, 100][index],
        mod_muzzle_001: [5, 15, 80, 100, 100][index],
        mod_equipment: [15, 25, 45, 75, 90][index],
        mod_equipment_000: [0, 0, 10, 35, 45][index],
        mod_equipment_001: [0, 0, 10, 35, 45][index],
        mod_equipment_002: [0, 0, 10, 35, 45][index],
        mod_pistol_grip_akms: [1, 25, 45, 55, 80][index],
        mod_pistol_grip: [1, 25, 45, 65, 80][index],
        mod_scope: [30, 70, 100, 100, 100][index],
        mod_scope_000: [30, 80, 100, 100, 100][index],
        mod_scope_001: [30, 80, 100, 100, 100][index],
        mod_scope_002: [30, 80, 100, 100, 100][index],
        mod_scope_003: [30, 80, 100, 100, 100][index],
        mod_tactical: [15, 30, 65, 70, 95][index],
        mod_tactical_2: 0,
        mod_tactical001: [5, 25, 45, 70, 85][index],
        mod_tactical002: [5, 25, 45, 70, 85][index],
        mod_tactical_000: [1, 5, 10, 45, 65][index],
        mod_tactical_001: [1, 5, 10, 45, 65][index],
        mod_tactical_002: [15, 30, 55, 70, 95][index],
        mod_tactical_003: [15, 30, 55, 70, 95][index],
        mod_charge: [10, 20, 55, 70, 95][index],
        mod_stock: [5, 15, 55, 70, 95][index],
        mod_stock_000: 99,
        // "mod_stock_001": [1, 10, 15, 20][index],
        mod_stock_akms: 100,
        mod_sight_front: [90, 40, 5, 0, 0][index],
        mod_sight_rear: [90, 40, 5, 0, 0][index],
        // "mod_reciever": 100,
        // "mod_gas_block": [1, 10, 15, 20][index],
        mod_pistolgrip: [1, 15, 45, 55, 90][index],
        // "mod_trigger": 1,
        // "mod_hammer": 1,
        // "mod_catch": 1
      },
      equipmentMods: {
        mod_nvg: 0,
        back_plate: [80, 90, 100, 100, 100][index],
        front_plate: [80, 90, 100, 100, 100][index],
        left_side_plate: [50, 80, 90, 90, 100][index],
        right_side_plate: [50, 80, 90, 90, 100][index],
        mod_flashlight: [5, 25, 35, 45, 70][index],
        mod_equipment: [15, 25, 25, 35, 70][index],
        mod_equipment_000: [0, 0, 0, 5, 20][index],
        mod_equipment_001: [0, 0, 5, 15, 25][index],
        mod_equipment_002: [0, 0, 5, 15, 25][index],
      },
    };

    traderList[num].forEach((id) => {
      const item = items[id];
      const parent = item._parent;
      switch (true) {
        case checkParentRecursive(
          parent,
          items,
          num >= 3 ? [painKillerParent, stimParent] : [painKillerParent]
        ): //stims
          // console.log(id, item._name, 5 - index);
          newItem.generation.stims.whitelist[id] = num * num * 5;
          break;
        case checkParentRecursive(parent, items, [medicalParent]): //drugs
          newItem.generation.drugs.whitelist[id] = num * num * 5;
          break;
        case checkParentRecursive(parent, items, [medKitParent]): //meds
          newItem.generation.healing.whitelist[id] = num * num * 5;
          // medkitsAdd[num].forEach((addId: string) => {
          //   newItem.generation.healing.whitelist[addId] = num * num * 5;
          // });
          // medkitsRemove[num].forEach((removeId: string) => {
          //   delete newItem.generation.healing.whitelist[removeId];
          // });

          break;
        case checkParentRecursive(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
          if (items[id]._props.ThrowType !== "smoke_grenade") {
            newItem.generation.grenades.whitelist[id] = num * num * 5;
          }
          break;
        default:
          break;
      }
    });

    randomizationItems.push(newItem);
  });

  botConfig.lootItemResourceRandomization["pmc"] = {
    food: {
      resourcePercent: 50,
      chanceMaxResourcePercent: 90,
    },
    meds: {
      resourcePercent: 50,
      chanceMaxResourcePercent: 70,
    },
  };
  // saveToFile(
  //   botConfig.lootItemResourceRandomization,
  //   "botConfiglootItemResourceRandomization.json"
  // );
  botConfig.equipment.pmc["forceStock"] = advancedConfig.forceStock;
  botConfig.equipment.pmc.randomisation = randomizationItems;
  // console.log(JSON.stringify(randomizationItems));
};

export const buildInitialUsecAppearance = (
  appearance: Appearance,
  items: Record<string, ICustomizationItem>
) => {
  appearance.feet = {
    "5cde95ef7d6c8b04713c4f2d": 15,
  };
  appearance.body = {
    "5cde95d97d6c8b647a3769b0": 15,
  };
  Object.keys(items).forEach((itemId) => {
    const item = items[itemId];
    if (item?._props?.Side?.includes("Usec"))
      switch (true) {
        case item._props.BodyPart === "Head":
          if (!appearance.head[itemId]) appearance.head[itemId] = 10;
          break;
        case item._props.BodyPart === "Hands":
          if (!appearance.hands[itemId]) appearance.hands[itemId] = 10;
          break;
        default:
          break;
      }
  });
};

export const buildInitialBearAppearance = (
  appearance: Appearance,
  items: Record<string, ICustomizationItem>
) => {
  appearance.feet = {
    "5cc085bb14c02e000e67a5c5": 10,
  };
  appearance.body = {
    "5cc0858d14c02e000c6bea66": 10,
  };
  Object.keys(items).forEach((itemId) => {
    const item = items[itemId];
    if (item?._props?.Side?.includes("Bear"))
      switch (true) {
        case item._props.BodyPart === "Head":
          if (!appearance.head[itemId]) appearance.head[itemId] = 10;
          break;
        case item._props.BodyPart === "Hands":
          if (!appearance.hands[itemId]) appearance.hands[itemId] = 10;
          break;
        // case item._parent === "5fc100cf95572123ae738483":
        //     if (!appearance.voice.includes(item._name)) appearance.voice.push(item._name)
        //     break;
        default:
          break;
      }
  });
};

export const buildClothingWeighting = (
  suit: ISuit[],
  items: Record<string, ICustomizationItem>,
  botConfig: IBotConfig,
  usecAppearance: Appearance,
  bearAppearance: Appearance
) => {
  buildInitialUsecAppearance(usecAppearance, items);
  buildInitialBearAppearance(bearAppearance, items);
  const levels = Object.values(levelRange);

  suit.forEach(
    ({ suiteId, requirements: { profileLevel, loyaltyLevel } = {} }) => {
      if (!profileLevel || !suiteId || loyaltyLevel === undefined) return;
      if (profileLevel === 0) profileLevel = 1;
      const index = levels.findIndex(({ min, max }) => {
        if (profileLevel >= min && profileLevel <= max) {
          return true;
        }
      });
      if (index === -1)
        return console.log(
          "Unable to find index for clothing item",
          items[suiteId]?._name
        );
      const clothingAdjust =
        botConfig.equipment.pmc.weightingAdjustmentsByBotLevel[index].clothing;

      if (index === undefined) return console.log("Empty index for: ", suiteId);
      if (items[suiteId]?._props?.Body) {
        switch (true) {
          case !!items[suiteId]?._name?.toLowerCase().includes("bear"):
            bearAppearance.body[items[suiteId]._props.Body] = 1;
            break;
          case !!items[suiteId]?._name?.toLowerCase().includes("usec"):
            usecAppearance.body[items[suiteId]._props.Body] = 1;
            break;
          default:
            bearAppearance.body[items[suiteId]._props.Body] = 1;
            usecAppearance.body[items[suiteId]._props.Body] = 1;
            break;
        }
        if (!clothingAdjust?.edit["body"]) clothingAdjust.edit["body"] = {};
        clothingAdjust.edit["body"][items[suiteId]._props.Body] =
          10 + index * 30;
      }

      if (items[suiteId]?._props?.Feet) {
        switch (true) {
          case !!items[suiteId]?._name?.toLowerCase().includes("bear"):
            bearAppearance.feet[items[suiteId]._props.Feet] = 1;
            break;
          case !!items[suiteId]?._name?.toLowerCase().includes("usec"):
            usecAppearance.feet[items[suiteId]._props.Feet] = 1;
            break;
          default:
            bearAppearance.feet[items[suiteId]._props.Feet] = 1;
            usecAppearance.feet[items[suiteId]._props.Feet] = 1;
            break;
        }

        if (!clothingAdjust?.edit["feet"]) clothingAdjust.edit["feet"] = {};
        clothingAdjust.edit["feet"][items[suiteId]._props.Feet] =
          10 + index * 30;
      }
    }
  );

  // console.log(JSON.stringify(clothingAdjust))
  // saveToFile(items, "/customization.json")
  // saveToFile(bearAppearance, "/bear.json")
  // saveToFile(usecAppearance, "/usec.json")
  // saveToFile(clothingAdjust, "/clothingWeighting.json")
};

export const weaponTypes = {
  "5447b6254bdc2dc3278b4568": [SightType.AssaultScope, SightType.OpticScope], // SniperRifle
  "5447b6194bdc2d67278b4567": [SightType.AssaultScope, SightType.OpticScope], // MarksmanRifle
  "5447b5fc4bdc2d87278b4567": [SightType.Collimator, SightType.AssaultScope], // AssaultCarbine
  "5447b5f14bdc2d61278b4567": [
    SightType.CompactCollimator,
    SightType.Collimator,
    SightType.AssaultScope,
  ], // AssaultRifle
  "5447bed64bdc2d97278b4568": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // MachineGun
  "5447b5e04bdc2d62278b4567": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // Smg
  "5447bee84bdc2dc3278b4569": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // SpecialWeapon
  "5447b6094bdc2dc3278b4567": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // Shotgun
  "5447b5cf4bdc2d65278b4567": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // Pistol
  "617f1ef5e8b54b0998387733": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // Revolver
  "5447bedf4bdc2d87278b4568": [
    SightType.CompactCollimator,
    SightType.Collimator,
  ], // GrenadeLauncher
};

export const buildWeaponSightWhitelist = (
  items: Record<string, ITemplateItem>,
  botConfig: IBotConfig,
  { 1: a, 2: b, 3: c, 4: d, 5: e }: TradersMasterList
) => {
  delete botConfig.equipment.pmc.weaponSightWhitelist;
  // botConfig.equipment.pmc.weaponSightWhitelist = {};
  return;
  const sightWhitelist = botConfig.equipment.pmc.weaponSightWhitelist;
  const traderItems = [...new Set([...a, ...b, ...c, ...d, ...e])]; //, ...d
  const blacklist = new Set(InternalBlacklist);
  traderItems.forEach((id) => {
    if (blacklist.has(id)) return;
    if (checkParentRecursive(id, items, Object.values(SightType))) {
      for (const key in weaponTypes) {
        const sightsToCheck = weaponTypes[key];
        if (checkParentRecursive(id, items, sightsToCheck)) {
          if (!sightWhitelist[key]) sightWhitelist[key] = [];
          sightWhitelist[key].push(id);
        }
      }
    }
  });
  // console.log(JSON.stringify(sightWhitelist))
};

export const buildBlacklist = (
  items: Record<string, ITemplateItem>,
  botConfig: IBotConfig,
  mods: { "1": {}; "2": {}; "3": {}; "4": {}; "5": {} }
) => {
  delete botConfig.equipment.pmc.blacklist[0].equipment.mod_magazine;
  const currentBlacklist = cloneDeep(botConfig.equipment.pmc.blacklist[0]);
  botConfig.equipment.pmc.blacklist = [];
  const blacklist = botConfig.equipment.pmc.blacklist;

  // const itemsToAddToBlacklist = ["mod_scope", "mod_magazine"]
  numList.forEach((num, index) => {
    const modList = mods[num];
    const range = levelRange[num];
    const loyalty = num;
    const base = { ...cloneDeep(currentBlacklist), levelRange: range };
    if (index < 2) {
      numList.splice(0, index + 2).forEach((numInner) => {
        Object.keys(mods[numInner]).forEach((key) => {
          if (!base.equipment[key]) base.equipment[key] = [];
          base.equipment[key].push(...mods[numInner][key]);
        });
      });
    }
    blacklist.push(base);
  });
};

export const deleteBlacklistedItemsFromInventory = (inventory: Inventory) => {
  Object.keys(inventory.items).forEach((key) => {
    Object.keys(inventory.items[key]).forEach((id) => {
      if (blacklistedItems.has(id)) delete inventory.items[key][id];
    });
  });

  Object.keys(inventory.Ammo).forEach((calibre) => {
    Object.keys(inventory.Ammo[calibre]).forEach((ammoKey) => {
      if (blacklistedItems.has(ammoKey)) {
        delete inventory.Ammo[calibre][ammoKey];
        // console.log(calibre, ammoKey, inventory.Ammo[calibre][ammoKey]);
      }
    });
  });

  Object.keys(inventory.mods).forEach((key) => {
    if (blacklistedItems.has(key)) {
      delete inventory.mods[key];
    } else {
      Object.keys(inventory.mods?.[key]).forEach((modtype) => {
        if (inventory.mods[key][modtype]?.length) {
          inventory.mods[key][modtype].filter(
            (id) => !blacklistedItems.has(id)
          );
        }
      });
    }
  });
};

export const ensureAllAmmoInSecuredContainer = (inventory: Inventory) => {
  const ammo = Object.keys(inventory.Ammo)
    .map((calbr) => Object.keys(inventory.Ammo[calbr]))
    .flat();

  inventory?.items?.SecuredContainer || {};

  ammo.forEach((id) => {
    if (!inventory?.items?.SecuredContainer?.[id]) {
      inventory.items.SecuredContainer[id] = 1;
    }
  });
  //   const sortedAmmo = ammo.sort(
  //     (a, b) => getAmmoWeighting(items[a]) - getAmmoWeighting(items[b])
  //   );
  //   saveToFile({ sortedAmmo }, "refDBS/ammoList.json");
};

export const fixEmptyChancePlates = (botConfig: IBotConfig) => {
  const armorPlateWeighting = botConfig.equipment.pmc.armorPlateWeighting;
  for (const key in armorPlateWeighting) {
    for (const subKey in armorPlateWeighting[key]) {
      if (!armorPlateWeighting[key][subKey]?.min) {
        for (const num in armorPlateWeighting[key][subKey]) {
          if (armorPlateWeighting[key][subKey][num] === 0) {
            armorPlateWeighting[key][subKey][num] = 1;
          }
        }
      }
    }
  }
};

export const addBossSecuredContainer = (inventory: Inventory) => {
  inventory.equipment.SecuredContainer = {
    "5c0a794586f77461c458f892": 1,
  };
};

export const combinedForbiddenBullets = new Set(
  Object.values(advancedConfig.forbiddenBullets).flat(1)
);

export const blacklistedItems = new Set([
  ...config.customBlacklist,
  ...InternalBlacklist,
]);
