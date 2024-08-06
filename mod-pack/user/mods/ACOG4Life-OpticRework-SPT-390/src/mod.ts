/*
* Class Mod
* Original Code by ACOGforlife and SAMSWAT
* Refactor for typescript by Tuhjay
* Maintained by Fontaine
* Written for AKI 3.9.x
* Last Change made July 16th 2024
*/

import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { opticRework }  from "./opticRework";

class Mod implements IPreSptLoadMod, IPostDBLoadMod
{
	// Code added here will load BEFORE the server has started loading
    public preSptLoad(container: DependencyContainer): void
    { 
        // get the logger from the server container
        const logger = container.resolve<ILogger>("WinstonLogger");
        logger.info("Initializing Optic Rework... ");
    }

    // Code added here will be run AFTER the server has started
    public postDBLoad(container: DependencyContainer): void
    { 
        const opticChanges = new opticRework();
        const runCode = opticChanges.runModLogic(container);
    }
}

module.exports = { mod: new Mod() }