import { IBotType } from "@spt/models/eft/common/tables/IBotType";
import { IHandbookBase } from "@spt/models/eft/common/tables/IHandbookBase";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import BaseClasses from "../Constants/BaseClasses";
import {
  blacklistedItems,
  checkParentRecursive,
  keyMechanical,
  saveToFile,
} from "./utils";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";

export const buildLootChanges = (
  items: Record<string, ITemplateItem>,
  handbook: IHandbookBase,
  prices: Record<string, number>,
  _: IPmcConfig,
  botConfig: IBotConfig,
  types: Record<string, IBotType>
) => {
  const assaultInventory = types.assault.inventory;
  const handbookMapper = {} as Record<string, number>;

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

  const getFleaPrice = (itemID: string): number => {
    if (typeof prices[itemID] != "undefined") {
      return prices[itemID];
    } else {
      return handbookMapper[itemID];
    }
  };

  const newToAdd = {
    [BaseClasses.BARTER_ITEM]: 50,
    [BaseClasses.HOUSEHOLD_GOODS]: 50,
    [BaseClasses.FOOD_DRINK]: 50,
    [BaseClasses.ELECTRONICS]: 1,
    [BaseClasses.JEWELRY]: 2,
    [BaseClasses.OTHER]: 1,
    [BaseClasses.TOOL]: 5,
    [BaseClasses.REPAIR_KITS]: 1,
    [BaseClasses.MONEY]: 1,
    "60b0f6c058e0b0481a09ad11": 1, //gingy
    "62a09d3bcf4a99369e262447": 1, //wallet
    "5783c43d2459774bbe137486": 1, //walletz
  };

  if (nonPmcBotConfig.addRandomizedKeysToScavs) {
    newToAdd[BaseClasses.KEY_MECHANICAL] = 1;
  }

  const itemsToRemove = new Set([
    BaseClasses.AMMO_BOX,
    BaseClasses.GEAR_MOD,
    BaseClasses.SILENCER,
    BaseClasses.KNIFE,
    BaseClasses.ASSAULT_SCOPE,
    BaseClasses.COLLIMATOR,
    BaseClasses.SPECIAL_SCOPE,
    BaseClasses.OPTIC_SCOPE,
    BaseClasses.FOREGRIP,
    BaseClasses.ARMOR,
    BaseClasses.VEST,
    BaseClasses.TACTICAL_COMBO,
  ]);

  const addList = Object.keys(newToAdd);
  const removeList = [...itemsToRemove];

  //limit keys on scavs
  botConfig.itemSpawnLimits.assault[BaseClasses.KEY_MECHANICAL] = 1;

  const randomlyAllowKey = (id) => {
    if (
      checkParentRecursive(id, items, [BaseClasses.KEY_MECHANICAL]) &&
      Math.random() > nonPmcBotConfig.percentageOfKeysInSpawnPool
    ) {
      // console.log(items[id]._name);
      return false;
    }
    return true;
  };

  const scavLootBlacklist = new Set(nonPmcBotConfig.scavLootBlacklist);

  const loot = Object.keys(items).filter(
    (id) =>
      !scavLootBlacklist.has(id) &&
      !blacklistedItems.has(id) &&
      randomlyAllowKey(id) &&
      checkParentRecursive(id, items, addList) &&
      !checkParentRecursive(id, items, [BaseClasses.MONEY, ...removeList]) &&
      !items[id]?._props?.QuestItem &&
      !!getFleaPrice(id)
  );

  const importedCustomLoot = nonPmcBotConfig?.additionalScavLoot.filter(
    (id) => !!items[id] && !!getFleaPrice(id)
  );

  const configmultiplier = 100 / nonPmcBotConfig.lootDisparityMultiplier;

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

  const finalValues: Record<string, number> = {};

  allLoot.forEach(({ value, id, name }, index) => {
    let rarity = reverseLoot[index];
    switch (true) {
      case reverseLoot[index] > top:
        rarity = top;
        break;
      case reverseLoot[index] < bottom:
        rarity = Math.round(
          rarity * (0.3 / nonPmcBotConfig.lootDisparityMultiplier)
        );
        break;
      default:
    }

    if (checkParentRecursive(id, items, [keyMechanical])) {
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
