"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupLocationGlobals = void 0;
const GlobalValues_1 = require("./GlobalValues");
const utils_1 = require("./utils");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const SetupLocationGlobals = (container) => {
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const databaseServer = container.resolve("DatabaseServer");
    const profileHelper = container.resolve("ProfileHelper");
    const tables = databaseServer.getTables();
    GlobalValues_1.globalValues.Logger = container.resolve("WinstonLogger");
    GlobalValues_1.globalValues.tables = tables;
    GlobalValues_1.globalValues.profileHelper = profileHelper;
    GlobalValues_1.globalValues.originalBotTypes = (0, utils_1.cloneDeep)(tables.bots.types);
    GlobalValues_1.globalValues.configServer = configServer;
    GlobalValues_1.globalValues.originalWeighting = (0, utils_1.cloneDeep)(botConfig.equipment.pmc);
    // globalValues.setValuesForLocation('woods', 1)
};
exports.SetupLocationGlobals = SetupLocationGlobals;
//# sourceMappingURL=SetupLocationGlobals.js.map