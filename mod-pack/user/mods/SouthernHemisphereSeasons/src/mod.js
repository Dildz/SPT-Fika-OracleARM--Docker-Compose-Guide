"use strict";
/*
 * Description:
 * SPT-Fika server mod that adjusts the weather settings based on the IRL season in the southern hemisphere.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config/config.json");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const utlis_1 = require("./utlis");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Path to the advanced weather configuration file
const weatherConfigPath = path.resolve(__dirname, "../config/weatherConfigAdvanced.json");
// Ensure the file exists before attempting to load it
let weatherBySeason;
if (fs.existsSync(weatherConfigPath)) {
    const weatherConfig = require(weatherConfigPath);
    weatherBySeason = weatherConfig.weatherBySeason;
}
else {
    console.error(`Weather configuration file not found at: ${weatherConfigPath}`);
    throw new Error("Critical error: Weather configuration file missing.");
}
// Get the IRL season based on the current date
function getRealLifeSeason() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const seasons = {
            SUMMER: new Date(year, 11, 21), // Dec 21
            AUTUMN: new Date(year, 2, 20), // Mar 20
            WINTER: new Date(year, 5, 21), // Jun 21
            SPRING: new Date(year, 8, 23) // Sep 23
        };
        if (now >= seasons.SUMMER || now < seasons.AUTUMN) {
            config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as SUMMER.");
            return 0; // SUMMER
        }
        if (now >= seasons.AUTUMN && now < seasons.WINTER) {
            config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as AUTUMN.");
            return 1; // AUTUMN
        }
        if (now >= seasons.WINTER && now < seasons.SPRING) {
            config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as WINTER.");
            return 2; // WINTER
        }
        if (now >= seasons.SPRING && now < seasons.SUMMER) {
            config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as SPRING.");
            return 3; // SPRING
        }
        config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Defaulting to SUMMER due to unexpected date range.");
        return 0; // Default to SUMMER
    }
    catch (error) {
        console.error("Error determining IRL season:", error);
        return 0; // Default to SUMMER in case of error
    }
}
// Main mod class
class SouthernHemisphereSeasons {
    preSptLoad(container) {
        const configServer = container.resolve("ConfigServer");
        const WeatherValues = configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        const staticRouterModService = container.resolve("StaticRouterModService");
        WeatherValues.overrideSeason = getRealLifeSeason();
        WeatherValues.weather = weatherBySeason[utlis_1.SeasonMap[WeatherValues.overrideSeason]];
        config_json_1.consoleMessages && console.log("Season in game set to:", utlis_1.SeasonMap[WeatherValues.overrideSeason]);
        // Apply the advanced weather settings if enabled
        config_json_1.enable && staticRouterModService.registerStaticRouter(`SouthernHemisphereSeasons`, [
            {
                url: "/client/match/offline/end",
                action: async (_url, info, sessionId, output) => {
                    WeatherValues.overrideSeason = getRealLifeSeason();
                    WeatherValues.weather = weatherBySeason[utlis_1.SeasonMap[WeatherValues.overrideSeason]];
                    if (config_json_1.lessFog) {
                        WeatherValues.weather.fog.weights = [20, 1, 1, 1, 1];
                        config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied less fog setting.");
                    }
                    if (config_json_1.lessRain) {
                        WeatherValues.weather.rain.weights = [5, 1, 1];
                        WeatherValues.weather.rainIntensity = { min: 0, max: 0.5 };
                        config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied less rain setting.");
                    }
                    if (config_json_1.clearSkies) {
                        WeatherValues.weather.clouds.weights = [30, 1, 1, 1, 1, 1];
                        config_json_1.consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied clear skies setting.");
                    }
                    config_json_1.consoleMessages && console.log(`SouthernHemisphereSeasons: Weather settings applied for ${utlis_1.SeasonMap[WeatherValues.overrideSeason]}.`);
                    return output;
                },
            },
        ], "aki");
    }
}
// Export the mod instance
module.exports = { mod: new SouthernHemisphereSeasons() };
//# sourceMappingURL=mod.js.map