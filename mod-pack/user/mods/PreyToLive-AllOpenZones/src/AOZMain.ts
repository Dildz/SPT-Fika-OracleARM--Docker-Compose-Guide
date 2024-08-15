/* 
 * AllOpenZones v1.0.7
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { LoggerTypes } from "../enums/AOZEnumLogger";
import { openZonesMap } from "./AOZExports";
import pkg from "../package.json";
import config from "../config/config.json";

class AOZMain implements IPostDBLoadMod {
    private logger: ILogger;

    public postDBLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const eftDatabaseLocations = container.resolve<DatabaseServer>("DatabaseServer").getTables().locations;

        if (config.modEnabled) {
            this.logger.log(`Mod: ${pkg.name}: enabled`, LoggerTypes.SUCCESS);

            try {
                for (const altLocation in openZonesMap) {
                    eftDatabaseLocations[altLocation].base.OpenZones = openZonesMap[altLocation].join(",");
                }

                if (config.consoleLogs) {
                    this.logger.log(`Mod: ${pkg.name}: logs`, LoggerTypes.INFO);

                    for (const [location, zones] of Object.entries(openZonesMap)) {
                        this.logger.log(`${location}:`, LoggerTypes.INFO);
                        
                        for (const zone of zones) {
                            this.logger.log(`\t${zone}`, LoggerTypes.INFO);
                        }
                    }
                }
            } catch (err) {
                this.logger.error(`Error in postDBload: ${err.message}`);
            }

        } else {
            this.logger.log(`Mod: ${pkg.name}: disabled`, LoggerTypes.WARNING);
        }
    }
}

module.exports = { mod: new AOZMain() };