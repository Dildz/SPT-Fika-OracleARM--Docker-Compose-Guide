/*
* Class Mod
* Original Code by ACOGforlife and SAMSWAT
* Refactor for typescript by Tuhjay
* Written for AKI 3.0.0
* Last Change made July 25th 2022
*/

import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { opticRework }  from "./opticRework";

class Mod implements IPreAkiLoadMod, IPostDBLoadMod
{
	// Code added here will load BEFORE the server has started loading
    public preAkiLoad(container: DependencyContainer): void
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