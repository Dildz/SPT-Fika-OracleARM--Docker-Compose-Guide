import { IPmcConfig } from "./../../types/models/spt/config/IPmcConfig.d";
import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import advancedConfig from "../../config/advancedConfig.json";
import config from "../../config/config.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig.d";
import {
  addBossSecuredContainer,
  addToModsObject,
  AmmoParent,
  armorPlateParent,
  blacklistedItems,
  buildEmptyWeightAdjustments,
  buildInitialRandomization,
  buildOutModsObject,
  buildWeaponSightWhitelist,
  checkParentRecursive,
  cloneDeep,
  combineWhitelist,
  deleteBlacklistedItemsFromInventory,
  ensureAllAmmoInSecuredContainer,
  fixEmptyChancePlates,
  getEquipmentType,
  magParent,
  moneyParent,
  numList,
  reduceAmmoChancesTo1,
  reduceEquipmentChancesTo1,
  saveToFile,
  setupBaseWhiteList,
  setupMods,
  setWeightingAdjustments,
  setWhitelists,
  TradersMasterList,
} from "./utils";
import Tier5 from "../Constants/Tier5";

import botConfigequipmentpmc from "../Cache/botConfigequipmentpmc.json";
import tablesbotstypesusec from "../Cache/tablesbotstypesusec.json";
import { globalValues } from "./GlobalValues";
import { buildLootChanges } from "./LootChanges";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { fixSpecificItemIssues } from "./FixSpecificScopeIssues";

export default function ProgressionChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const tables = databaseServer.getTables();
  const configServer = container.resolve<ConfigServer>("ConfigServer");

  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
  const pmcConfig = configServer.getConfig<IPmcConfig>(ConfigTypes.PMC);
  const Logger = container.resolve<ILogger>("WinstonLogger");

  const items = tables.templates.items;

  const traders = tables.traders;

  const usecInventory = tables.bots.types.usec.inventory;
  const bearInventory = tables.bots.types.bear.inventory;
  const prices = tables.templates.prices;
  const handbook = tables.templates.handbook;

  let loot: Record<string, number> = {};

  if (config.enableLootChanges && !config.forceCached) {
    try {
      loot = buildLootChanges(
        items,
        handbook,
        prices,
        pmcConfig,
        botConfig,
        tables.bots.types
      );
    } catch (error) {
      Logger.error(
        "Algorthimic Progression: buildLootChanges failed, maybe try turning off 'enableLootChanges', \nError: " +
          error
      );
    }
  }

  if (botConfig.secureContainerAmmoStackCount < 80)
    botConfig.secureContainerAmmoStackCount = 80;
  if (!pmcConfig.forceHealingItemsIntoSecure)
    pmcConfig.forceHealingItemsIntoSecure = true;

  pmcConfig.looseWeaponInBackpackChancePercent = 2;
  pmcConfig.looseWeaponInBackpackLootMinMax = { min: 0, max: 1 };

  if (config?.forceCached !== true) {
    try {
      const tradersToInclude = [
        "Prapor",
        "Therapist",
        "Skier",
        "Peacekeeper",
        "Mechanic",
        "Ragman",
        "Jaeger",
      ];

      const tradersToExclude = [
        "Unknown",
        "caretaker",
        "Fence",
        "БТР",
        ...config.customTradersToExclude,
      ];

      const traderList = Object.values(traders).filter(({ base }) => {
        if (config.addCustomTraderItems) {
          return !tradersToExclude.includes(base.nickname);
        }
        return tradersToInclude.includes(base.nickname);
      });

      botConfig.equipment.pmc.nvgIsActiveChanceNightPercent = 95;
      botConfig.equipment.pmc.lightIsActiveNightChancePercent = 95;
      botConfig.equipment.pmc.laserIsActiveChancePercent = 90;
      botConfig.equipment.pmc.faceShieldIsActiveChancePercent = 100;
      botConfig.equipment.pmc.weightingAdjustmentsByBotLevel =
        buildEmptyWeightAdjustments();

      // >>>>>>>>>>>>>>> Working tradersMasterList <<<<<<<<<<<<<<<<<<
      const tradersMasterList: TradersMasterList = {
        1: new Set(["572b7adb24597762ae139821", "5fd4c4fa16cac650092f6771"]),
        2: new Set(),
        3: new Set(),
        4: new Set(),
        5: new Set(Object.values(Tier5).flat(1)),
      };

      const mods = { "1": {}, "2": {}, "3": {}, "4": {}, "5": {} };

      // SetBaseWhitelist
      botConfig.equipment.pmc.whitelist = setupBaseWhiteList();

      traderList.forEach(
        (
          {
            base: { nickname },
            questassort,
            assort: {
              items: tradeItems,
              loyal_level_items,
              barter_scheme,
            } = {},
          },
          index
        ) => {
          if (!tradeItems || !nickname) return;

          // if (index === 0) console.log(JSON.stringify(questassort))
          if (
            config.addCustomTraderItems &&
            ![...tradersToExclude, ...tradersToInclude].includes(nickname)
          ) {
            console.log(
              `\nAlgorithmicLevelProgression: Attempting to add items for custom trader > ${nickname}!\n`
            );
          }
          tradeItems.forEach(({ _tpl, _id, parentId, slotId }) => {
            if (
              blacklistedItems.has(_tpl) ||
              checkParentRecursive(_tpl, items, [armorPlateParent])
            )
              return; //Remove blacklisted items and bullets
            const item = items[_tpl];
            if (!item)
              return console.log(
                "AlgorithmicLevelProgression: Skipping custom item: ",
                _tpl,
                " for trader: ",
                nickname
              );
            const parent = item._parent;
            if (!parent || !items[parent])
              return console.log(
                "AlgorithmicLevelProgression: Skipping custom item: ",
                _tpl,
                " for trader: ",
                nickname
              );
            const equipmentType = getEquipmentType(parent, items);

            switch (true) {
              //Add Ammo
              case checkParentRecursive(parent, items, [AmmoParent]):
                const calibre = item._props.Caliber || item._props.ammoCaliber;
                if (calibre) {
                  usecInventory.Ammo[calibre] = {
                    ...(usecInventory.Ammo[calibre] || {}),
                    [_tpl]: 1,
                  };
                  bearInventory.Ammo[calibre] = {
                    ...(bearInventory.Ammo[calibre] || {}),
                    [_tpl]: 1,
                  };

                  usecInventory.items.SecuredContainer[_tpl] = 1;
                  bearInventory.items.SecuredContainer[_tpl] = 1;
                } else {
                  console.log(
                    item._name,
                    " likely has the incorrect calibre: ",
                    calibre
                  );
                }
                break;
              case checkParentRecursive(parent, items, [magParent]):
                usecInventory.items.SecuredContainer[_tpl] = 1;
                bearInventory.items.SecuredContainer[_tpl] = 1;
                break;
              // case equipmentType === "mod_scope":
              //     break;
              // Check if revolver shotgun
              case _tpl === "60db29ce99594040e04c4a27":
                if (!usecInventory.equipment["FirstPrimaryWeapon"])
                  usecInventory.equipment["FirstPrimaryWeapon"] = {};
                if (!bearInventory.equipment["FirstPrimaryWeapon"])
                  bearInventory.equipment["FirstPrimaryWeapon"] = {};
                usecInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1;
                bearInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1;
                break;
              // Check if sawed-off shotgun
              case _tpl === "64748cb8de82c85eaf0a273a":
                if (!usecInventory.equipment["Holster"])
                  usecInventory.equipment["Holster"] = {};
                if (!bearInventory.equipment["Holster"])
                  bearInventory.equipment["Holster"] = {};
                usecInventory.equipment["Holster"][_tpl] = 1;
                bearInventory.equipment["Holster"][_tpl] = 1;
                break;
              // Add matching equipment
              case !!equipmentType:
                if (!usecInventory.equipment[equipmentType])
                  usecInventory.equipment[equipmentType] = {};
                if (!bearInventory.equipment[equipmentType])
                  bearInventory.equipment[equipmentType] = {};
                usecInventory.equipment[equipmentType][_tpl] = 1;
                bearInventory.equipment[equipmentType][_tpl] = 1;
                break;
              default:
                break;
            }

            const loyaltyLevel =
              loyal_level_items[_id] || loyal_level_items[parentId];

            //Set trader list for levels
            if (loyaltyLevel) {
              const barterSchemeRef =
                barter_scheme[_id] || barter_scheme[parentId];

              switch (true) {
                // If large magazine
                case checkParentRecursive(_tpl, items, [magParent]) &&
                  item?._props?.Cartridges?.[0]?._max_count > 39:
                  // if (item?._props?.Cartridges?.[0]?._max_count > 39) {
                  //     tradersMasterList[5].add(_tpl)
                  //     return
                  // }
                  // tradersMasterList[loyaltyLevel].add(_tpl)

                  // addToModsObject(mods, _tpl, items, loyaltyLevel, slotId)
                  break;
                // Check if its a quest unlocked trade
                case !!questassort.success[_id]:
                  if (!config?.questUnlockedItemsShifted) {
                    tradersMasterList[loyaltyLevel].add(_tpl);

                    addToModsObject(mods, _tpl, items, loyaltyLevel, slotId);
                  } else {
                    if (loyaltyLevel === 4) {
                      tradersMasterList[4].add(_tpl);

                      addToModsObject(mods, _tpl, items, 4, slotId);
                    } else {
                      tradersMasterList[loyaltyLevel + 1].add(_tpl);

                      addToModsObject(
                        mods,
                        _tpl,
                        items,
                        loyaltyLevel + 1,
                        slotId
                      );
                    }
                  }
                  break;
                // Only add the item if it's a cash trade or if tradeItems are not shifted
                case items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent ===
                  moneyParent || !config?.tradedItemsShifted:
                  tradersMasterList[loyaltyLevel].add(_tpl);

                  addToModsObject(mods, _tpl, items, loyaltyLevel, slotId);
                  break;
                // Then it's a tradeItem
                default:
                  if (loyaltyLevel + 2 > 4) {
                    tradersMasterList[4].add(_tpl);

                    addToModsObject(mods, _tpl, items, 4, slotId);
                  } else {
                    tradersMasterList[loyaltyLevel + 2].add(_tpl);

                    addToModsObject(
                      mods,
                      _tpl,
                      items,
                      loyaltyLevel + 2,
                      slotId
                    );
                  }
                  break;
              }
            }
          });
        }
      );

      //Setup beast mod level 5
      tradersMasterList[5].forEach((id) => {
        if (blacklistedItems.has(id)) {
          tradersMasterList[5].delete(id);
        } else {
          const item = items[id];
          const parent = items[id]?._parent;
          if (!item || !parent) return;
          const equipmentType = getEquipmentType(parent, items);

          switch (true) {
            case checkParentRecursive(parent, items, [AmmoParent]):
              const calibre = item._props.Caliber || item._props.ammoCaliber;
              if (calibre) {
                usecInventory.Ammo[calibre] = {
                  ...(usecInventory.Ammo[calibre] || {}),
                  [id]: 1,
                };
                bearInventory.Ammo[calibre] = {
                  ...(bearInventory.Ammo[calibre] || {}),
                  [id]: 1,
                };
              }
              break;
            case !!equipmentType:
              if (!usecInventory.equipment[equipmentType])
                usecInventory.equipment[equipmentType] = {};
              if (!bearInventory.equipment[equipmentType])
                bearInventory.equipment[equipmentType] = {};
              usecInventory.equipment[equipmentType][id] = 1;
              bearInventory.equipment[equipmentType][id] = 1;
              break;
            default:
              break;
          }
        }
      });

      const combinedNumList = new Set([
        ...tradersMasterList[1],
        ...tradersMasterList[2],
        ...tradersMasterList[3],
        ...tradersMasterList[4],
      ]);
      //TODO: keep an eye on this.. this might be a bad idea.
      const combinedNumWith5List = new Set([
        ...combinedNumList,
        ...tradersMasterList[5],
      ]);

      buildWeaponSightWhitelist(items, botConfig, tradersMasterList);
      buildOutModsObject(combinedNumWith5List, items, usecInventory, botConfig);
      bearInventory.mods = cloneDeep(usecInventory.mods);

      setupMods(mods);

      // lets disable this for now
      // addKeysToPockets(combinedNumList, items, tables.bots.types.assault.inventory);

      //Make everything level 1 in equipment
      reduceEquipmentChancesTo1(usecInventory);
      reduceEquipmentChancesTo1(bearInventory);
      reduceAmmoChancesTo1(usecInventory);
      reduceAmmoChancesTo1(bearInventory);

      // Eliminates duplicate id's in later levels
      numList.forEach((num) => {
        tradersMasterList[num].forEach((id) => {
          numList.slice(num, 5).forEach((numListNum) => {
            tradersMasterList[numListNum].delete(id);
          });
        });
      });

      if (botConfig.equipment.pmc.blacklist?.[0]?.equipment) {
        if (
          !botConfig.equipment.pmc.blacklist?.[0]?.equipment?.FirstPrimaryWeapon
        )
          botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon =
            [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.mod_scope)
          botConfig.equipment.pmc.blacklist[0].equipment.mod_scope = [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.mod_handguard)
          botConfig.equipment.pmc.blacklist[0].equipment.mod_handguard = [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.Headwear)
          botConfig.equipment.pmc.blacklist[0].equipment.Headwear = [];
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon.push(
          "624c0b3340357b5f566e8766",
          "624c0b3340357b5f566e8766",
          "6217726288ed9f0845317459",
          "62389be94d5d474bf712e709"
        );
        botConfig.equipment.pmc.blacklist[0].equipment.mod_scope.push(
          "544a3d0a4bdc2d1b388b4567"
        );
        botConfig.equipment.pmc.blacklist[0].equipment.mod_stock.push(
          "5a0c59791526d8dba737bba7"
        );
        botConfig.equipment.pmc.blacklist[0].equipment.Headwear.push(
          "5c066ef40db834001966a595"
        );
      }

      setWhitelists(items, botConfig, tradersMasterList, mods);
      setWeightingAdjustments(items, botConfig, tradersMasterList, mods);

      let lootingBotsDetected = false;
      if (
        tables?.bots?.types?.bear?.generation?.items?.backpackLoot?.weights &&
        new Set(
          Object.values(
            tables.bots.types.bear.generation.items.backpackLoot.weights
          )
        ).size === 1
      ) {
        console.log("[AlgorithmicLevelProgression] Looting bots detected");
        lootingBotsDetected = true;
      }

      buildInitialRandomization(
        items,
        botConfig,
        tradersMasterList,
        lootingBotsDetected
      );

      deleteBlacklistedItemsFromInventory(usecInventory);
      deleteBlacklistedItemsFromInventory(bearInventory);

      // add ai2 and surv to bot containerq

      // cms
      usecInventory.items.SecuredContainer["5d02778e86f774203e7dedbe"] = 1;
      bearInventory.items.SecuredContainer["5d02778e86f774203e7dedbe"] = 1;
      // ai2
      usecInventory.items.SecuredContainer["5755356824597772cb798962"] = 1;
      bearInventory.items.SecuredContainer["5755356824597772cb798962"] = 1;
      // Splint
      usecInventory.items.SecuredContainer["5af0454c86f7746bf20992e8"] = 1;
      bearInventory.items.SecuredContainer["5af0454c86f7746bf20992e8"] = 1;
      // Esmarch5e831507ea0a7c419c2f9bd9
      usecInventory.items.SecuredContainer["5e831507ea0a7c419c2f9bd9"] = 1;
      bearInventory.items.SecuredContainer["5e831507ea0a7c419c2f9bd9"] = 1;

      ensureAllAmmoInSecuredContainer(usecInventory);
      ensureAllAmmoInSecuredContainer(bearInventory);

      addBossSecuredContainer(usecInventory);
      addBossSecuredContainer(bearInventory);

      // addAllMedsToInventory(combinedNumWith5List, usecInventory, items);

      fixEmptyChancePlates(botConfig);

      fixSpecificItemIssues(usecInventory);
      fixSpecificItemIssues(bearInventory);
    } catch (error) {
      config.forceCached = true;
      throw Error(
        "Failed to dynamically update items, likely a mod conflict, turning on forceCached and will try again! \nError: " +
          error
      );
    }
  } else {
    botConfig.equipment.pmc = botConfigequipmentpmc as any;
    tables.bots.types.usec = tablesbotstypesusec as any;
    tables.bots.types.bear = tablesbotstypesusec as any;
  }

  if (config.strictEquipmentTiering === false) {
    combineWhitelist(botConfig.equipment.pmc);
  }

  Object.keys(advancedConfig.otherBotTypes).forEach((botType) => {
    botConfig.equipment[botType] = {
      ...botConfig.equipment[botType],
      ...advancedConfig.otherBotTypes[botType],
    };
  });

  if (
    tables?.bots?.types?.assault?.generation?.items?.backpackLoot?.weights &&
    new Set(
      Object.values(
        tables.bots.types.assault.generation.items.backpackLoot.weights
      )
    ).size === 1
  ) {
    const generation = (botConfig.equipment.assault.randomisation[0] as any)
      .generation;
    generation.backpackLoot = {
      ...(generation.looseLoot || {}),
      weights: { "0": 1 },
      whitelist: {},
    };
    generation.pocketLoot = {
      ...(generation.looseLoot || {}),
      weights: { "0": 1 },
      whitelist: {},
    };
    generation.vestLoot = {
      ...(generation.looseLoot || {}),
      weights: { "0": 1 },
      whitelist: {},
    };
  }

  // saveToFile(botConfig, "botConfig1.json");
  // saveToFile(pmcConfig, "pmcConfig1.json");

  globalValues.originalBotTypes = cloneDeep(tables.bots.types);
  globalValues.originalWeighting = cloneDeep(botConfig.equipment.pmc);
  // tables.bots.types.usec
  // botConfig.equipment.pmc
  // saveToFile(tables.bots.types.usec, `Cache/tablesbotstypesusec.json`);
  // saveToFile(botConfig.equipment.pmc, `Cache/botConfigequipmentpmc.json`);

  config.debug ||
    (config.forceCached &&
      console.log("Algorthimic Progression: Progression Changes completed"));
}

//59ef13ca86f77445fd0e2483
//5b4329f05acfc47a86086aa1
