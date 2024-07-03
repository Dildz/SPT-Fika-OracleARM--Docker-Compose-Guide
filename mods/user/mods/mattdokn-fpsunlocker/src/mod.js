"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FpsUnlocker {
    modConfig = require("../config/config.json");
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        databaseServer.getTables().settings.config.FramerateLimit.MaxFramerateLobbyLimit = Number(this.modConfig["framerate"]);
        databaseServer.getTables().settings.config.FramerateLimit.MaxFramerateGameLimit = Number(this.modConfig["framerate"]);
        logger.info("[FpsUnlocker] Applied framerate settings.");
    }
}
module.exports = { mod: new FpsUnlocker() };
//# sourceMappingURL=mod.js.map