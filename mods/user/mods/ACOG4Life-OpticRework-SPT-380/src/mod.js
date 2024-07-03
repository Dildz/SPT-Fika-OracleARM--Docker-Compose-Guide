"use strict";
/*
* Class Mod
* Original Code by ACOGforlife and SAMSWAT
* Refactor for typescript by Tuhjay
* Written for AKI 3.0.0
* Last Change made July 25th 2022
*/
Object.defineProperty(exports, "__esModule", { value: true });
const opticRework_1 = require("./opticRework");
class Mod {
    // Code added here will load BEFORE the server has started loading
    preAkiLoad(container) {
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        logger.info("Initializing Optic Rework... ");
    }
    // Code added here will be run AFTER the server has started
    postDBLoad(container) {
        const opticChanges = new opticRework_1.opticRework();
        const runCode = opticChanges.runModLogic(container);
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map