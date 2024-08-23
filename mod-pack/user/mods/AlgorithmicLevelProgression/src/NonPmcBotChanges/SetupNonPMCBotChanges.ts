import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import config from "../../config/config.json";
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";

import {
  addItemsToBotInventory,
  applyValuesToStoredEquipment,
  buildEmptyWeightAdjustmentsByDevision,
  normalizeMedianInventoryValues,
} from "./NonPmcUtils";
import { globalValues } from "../LoadoutChanges/GlobalValues";
import { saveToFile } from "../LoadoutChanges/utils";

export default function SetupNonPMCBotChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const tables = databaseServer.getTables();
  const items = tables.templates.items;
  const botsForUpdate = nonPmcBotConfig?.nonPmcBots;

  Object.keys(nonPmcBotConfig?.nonPmcBots).forEach((name) => {
    if (nonPmcBotConfig[name]?.length) {
      nonPmcBotConfig[name].forEach((listName) => {
        botsForUpdate[listName] = nonPmcBotConfig.nonPmcBots[name];
      });
    }
  });

  const botConfig = globalValues.configServer.getConfig<IBotConfig>(
    ConfigTypes.BOT
  );

  Object.keys(botsForUpdate).forEach((name) => {
    if (botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel) {
      botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel = [];
    }

    if (!tables.bots.types[name]?.inventory?.Ammo) return;
    const inventory = tables.bots.types[name].inventory;

    addItemsToBotInventory(inventory, nonPmcBotConfig.nonPmcBots[name], items);

    normalizeMedianInventoryValues(inventory);

    const storedEquipmentValues = buildEmptyWeightAdjustmentsByDevision(
      nonPmcBotConfig.nonPmcBots[name]
    );

    applyValuesToStoredEquipment(inventory, items, storedEquipmentValues);

    globalValues.storedEquipmentValues[name] = storedEquipmentValues;
  });

  // globalValues.updateInventory(1);

  // saveToFile(
  //   globalValues.storedEquipmentValues["assault"],
  //   `NonPmcBotChanges/botsRef/stored69.json`
  // );

  // saveToFile(botConfig.equipment.assault, "refDBS/weightings2F.json");
  // saveToFile(
  //   globalValues.tables.bots.types["assault"]?.inventory,
  //   `NonPmcBotChanges/botsRef/storedAssault.json`
  // );

  config.debug &&
    console.log("Algorthimic Progression: nonPmcBots equipment stored!");
}
