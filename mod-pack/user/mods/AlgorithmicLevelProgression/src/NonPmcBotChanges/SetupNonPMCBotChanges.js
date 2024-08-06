"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_1 = __importDefault(require("../../config/config.json"));
const nonPmcBotConfig_json_1 = __importDefault(require("../../config/nonPmcBotConfig.json"));
const NonPmcUtils_1 = require("./NonPmcUtils");
const GlobalValues_1 = require("../LoadoutChanges/GlobalValues");
function SetupNonPMCBotChanges(container) {
    const databaseServer = container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const botsForUpdate = nonPmcBotConfig_json_1.default?.nonPmcBots;
    Object.keys(nonPmcBotConfig_json_1.default?.nonPmcBots).forEach((name) => {
        if (nonPmcBotConfig_json_1.default[name]?.length) {
            nonPmcBotConfig_json_1.default[name].forEach((listName) => {
                botsForUpdate[listName] = nonPmcBotConfig_json_1.default.nonPmcBots[name];
            });
        }
    });
    const botConfig = GlobalValues_1.globalValues.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    Object.keys(botsForUpdate).forEach((name) => {
        if (botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel) {
            botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel = [];
        }
        if (!tables.bots.types[name]?.inventory?.Ammo)
            return;
        const inventory = tables.bots.types[name].inventory;
        (0, NonPmcUtils_1.addItemsToBotInventory)(inventory, nonPmcBotConfig_json_1.default.nonPmcBots[name], items);
        (0, NonPmcUtils_1.normalizeMedianInventoryValues)(inventory);
        const storedEquipmentValues = (0, NonPmcUtils_1.buildEmptyWeightAdjustmentsByDevision)(nonPmcBotConfig_json_1.default.nonPmcBots[name]);
        (0, NonPmcUtils_1.applyValuesToStoredEquipment)(inventory, items, storedEquipmentValues);
        GlobalValues_1.globalValues.storedEquipmentValues[name] = storedEquipmentValues;
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
    config_json_1.default.debug &&
        console.log("Algorthimic Progression: nonPmcBots equipment stored!");
}
exports.default = SetupNonPMCBotChanges;
//# sourceMappingURL=SetupNonPMCBotChanges.js.map