"use strict";
/*
 * AllOpenZones v1.0.7
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AOZEnumLogger_1 = require("../enums/AOZEnumLogger");
const AOZExports_1 = require("./AOZExports");
const package_json_1 = __importDefault(require("../package.json"));
const config_json_1 = __importDefault(require("../config/config.json"));
class AOZMain {
    logger;
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const eftDatabaseLocations = container.resolve("DatabaseServer").getTables().locations;
        if (config_json_1.default.modEnabled) {
            this.logger.log(`Mod: ${package_json_1.default.name}: enabled`, AOZEnumLogger_1.LoggerTypes.SUCCESS);
            try {
                for (const altLocation in AOZExports_1.openZonesMap) {
                    eftDatabaseLocations[altLocation].base.OpenZones = AOZExports_1.openZonesMap[altLocation].join(",");
                }
                if (config_json_1.default.consoleLogs) {
                    this.logger.log(`Mod: ${package_json_1.default.name}: logs`, AOZEnumLogger_1.LoggerTypes.INFO);
                    for (const [location, zones] of Object.entries(AOZExports_1.openZonesMap)) {
                        this.logger.log(`${location}:`, AOZEnumLogger_1.LoggerTypes.INFO);
                        for (const zone of zones) {
                            this.logger.log(`\t${zone}`, AOZEnumLogger_1.LoggerTypes.INFO);
                        }
                    }
                }
            }
            catch (err) {
                this.logger.error(`Error in postDBload: ${err.message}`);
            }
        }
        else {
            this.logger.log(`Mod: ${package_json_1.default.name}: disabled`, AOZEnumLogger_1.LoggerTypes.WARNING);
        }
    }
}
module.exports = { mod: new AOZMain() };
//# sourceMappingURL=AOZMain.js.map