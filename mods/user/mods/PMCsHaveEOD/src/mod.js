"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
let logger;
let configServer;
let pmcConfig;
class Mod {
    postDBLoad(container) {
        logger = container.resolve("WinstonLogger");
        configServer = container.resolve("ConfigServer");
        pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        const bots = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        bots.gameVersionWeight = {
            "edge_of_darkness": 100
        };
        bots.accountTypeWeight = {
            "2": 100
        };
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map