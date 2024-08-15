"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrightLasers {
    mod;
    constructor() {
        this.mod = "acidphantasm-brightlasers"; // Set name of mod so we can log it to console later
    }
    postSptLoad(container) {
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        logger.log(`[${this.mod}] Bundle loaded.`, "green");
    }
}
module.exports = { mod: new BrightLasers() };
//# sourceMappingURL=mod.js.map