"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const GlobalValues_1 = require("./GlobalValues");
function ClothingChanges(container) {
    const databaseServer = container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const usecAppearance = tables.bots.types.usec.appearance;
    const bearAppearance = tables.bots.types.bear.appearance;
    const traders = tables.traders;
    const customization = tables.templates.customization;
    let allTradersSuits = Object.values(traders)
        .filter(({ suits }) => !!suits?.length)
        .map(({ suits }) => suits)
        .flat(1);
    (0, utils_1.buildClothingWeighting)(allTradersSuits, customization, botConfig, usecAppearance, bearAppearance);
    GlobalValues_1.globalValues.originalBotTypes = (0, utils_1.cloneDeep)(tables.bots.types);
    GlobalValues_1.globalValues.originalWeighting = (0, utils_1.cloneDeep)(botConfig.equipment.pmc);
}
exports.default = ClothingChanges;
//# sourceMappingURL=ClothingChanges.js.map