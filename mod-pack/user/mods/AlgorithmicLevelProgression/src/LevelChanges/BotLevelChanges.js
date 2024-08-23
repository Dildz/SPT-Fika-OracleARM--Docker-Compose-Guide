"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../../config/config.json");
const utils_1 = require("../LoadoutChanges/utils");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_2 = __importDefault(require("../../config/config.json"));
function BotLevelChanges(container) {
    const profileHelper = container.resolve("ProfileHelper");
    const botLevelGenerator = container.resolve("BotLevelGenerator");
    const configServer = container.resolve("ConfigServer");
    const pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
    pmcConfig.botRelativeLevelDeltaMax = 1;
    container.afterResolution("BotLevelGenerator", (_t, result) => {
        result.generateBotLevel = (levelDetails, botGenerationDetails, bot) => {
            if (!botGenerationDetails.isPmc)
                return botLevelGenerator.generateBotLevel(levelDetails, botGenerationDetails, bot);
            const { playerLevel } = botGenerationDetails;
            const currentLevelRange = (0, utils_1.getCurrentLevelRange)(playerLevel);
            const currentRangeArray = config_json_1.botRangeAtLevel[currentLevelRange];
            const test = currentRangeArray.map((val, k) => ({
                levelRange: k + 1,
                val: Math.random() * val,
            }));
            const randomizedRange = test.sort((a, b) => b.val - a.val)[0]
                .levelRange;
            const range = { ...config_json_1.levelRange[randomizedRange] };
            if (range.max > 79) {
                range.max = 79;
            }
            if (range.min > 70) {
                range.min = 50;
            }
            const level = Math.round((range.max - range.min) * Math.random()) + range.min;
            const final = {
                level,
                exp: profileHelper.getExperience(level),
            };
            // debug && console.log(final)
            return final;
        };
    }, { frequency: "Always" });
    config_json_2.default.debug &&
        console.log("Algorthimic Progression: BotLevelGenerator registered");
}
exports.default = BotLevelChanges;
//# sourceMappingURL=BotLevelChanges.js.map