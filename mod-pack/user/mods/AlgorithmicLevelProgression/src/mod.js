"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotLevelChanges_1 = __importDefault(require("./LevelChanges/BotLevelChanges"));
const config_json_1 = require("../config/config.json");
const ProgressionChanges_1 = __importDefault(require("./LoadoutChanges/ProgressionChanges"));
const SetupLocationGlobals_1 = require("./LoadoutChanges/SetupLocationGlobals");
const LocationUpdater_1 = require("./LoadoutChanges/LocationUpdater");
const SetupNonPMCBotChanges_1 = __importDefault(require("./NonPmcBotChanges/SetupNonPMCBotChanges"));
const ClothingChanges_1 = __importDefault(require("./LoadoutChanges/ClothingChanges"));
class AlgorithmicLevelProgression {
    preSptLoad(container) {
        config_json_1.enableLevelChanges && (0, BotLevelChanges_1.default)(container);
        config_json_1.enableProgressionChanges && (0, LocationUpdater_1.LocationUpdater)(container);
    }
    postDBLoad(container) {
        if (config_json_1.enableProgressionChanges) {
            try {
                (0, ProgressionChanges_1.default)(container);
            }
            catch (error) {
                const Logger = container.resolve("WinstonLogger");
                const hasForceCachedChanged = !!error?.message?.includes("forceCached");
                if (hasForceCachedChanged) {
                    Logger.error(`Algorithmic Level Progression failed to make progression changes.
            Trying again using "forceCached" enabled.
            Try changing your mod loader so ALP is earlier than mods that add custom items to avoid this message in the future.
            Error: ` + error?.message);
                    (0, ProgressionChanges_1.default)(container);
                }
                else {
                    Logger.error(`Algorithmic Level Progression failed to make progression changes.
            Try changing your mod loader so ALP is earlier than mods that add custom items 
            Error: ` + error?.message);
                }
            }
            (0, SetupLocationGlobals_1.SetupLocationGlobals)(container);
        }
        config_json_1.enableNonPMCBotChanges && (0, SetupNonPMCBotChanges_1.default)(container);
    }
    postSptLoad(container) {
        try {
            config_json_1.leveledClothing && (0, ClothingChanges_1.default)(container);
        }
        catch (error) {
            const Logger = container.resolve("WinstonLogger");
            Logger.error(`Algorithmic Level Progression failed to makeclothing changes.
        Try turning off custom clothing in the config!
        Error: ` + error?.message);
        }
    }
}
module.exports = { mod: new AlgorithmicLevelProgression() };
//# sourceMappingURL=mod.js.map