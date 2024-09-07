/*
 * Description: 
 * SPT-Fika server mod that adjusts the weather settings based on the IRL season in the southern hemisphere.
 *
 */

// Import required classes and interfaces
import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import {
  enable,
  consoleMessages,
  lessFog,
  lessRain,
  clearSkies,
} from "../config/config.json";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { SeasonMap } from "./utlis";
import * as path from "path";
import * as fs from "fs";

// Path to the advanced weather configuration file
const weatherConfigPath = path.resolve(__dirname, "../config/weatherConfigAdvanced.json");

// Ensure the file exists before attempting to load it
let weatherBySeason: any;
if (fs.existsSync(weatherConfigPath)) {
  const weatherConfig = require(weatherConfigPath);
  weatherBySeason = weatherConfig.weatherBySeason;
} else {
  console.error(`Weather configuration file not found at: ${weatherConfigPath}`);
  throw new Error("Critical error: Weather configuration file missing.");
}

// Get the IRL season based on the current date
function getRealLifeSeason(): number {
  try {
    const now = new Date();
    const year = now.getFullYear();

    // Define the start dates for each season based on the 1st of the month
    const seasons = {
      SUMMER: new Date(year, 11, 1), // Starts Dec 1
      AUTUMN: new Date(year, 2, 1),  // Starts Mar 1
      WINTER: new Date(year, 5, 1),  // Starts Jun 1
      SPRING: new Date(year, 8, 1)   // Starts Sep 1
    };

    if (now >= seasons.SUMMER || now < seasons.AUTUMN) {
      consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as SUMMER.");
      return 0; // SUMMER
    }
    if (now >= seasons.AUTUMN && now < seasons.WINTER) {
      consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as AUTUMN.");
      return 1; // AUTUMN
    }
    if (now >= seasons.WINTER && now < seasons.SPRING) {
      consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as WINTER.");
      return 2; // WINTER
    }
    if (now >= seasons.SPRING && now < seasons.SUMMER) {
      consoleMessages && console.log("[SouthernHemisphereSeasons] : Detected current IRL season as SPRING.");
      return 3; // SPRING
    }

    consoleMessages && console.log("[SouthernHemisphereSeasons] : Defaulting to SUMMER due to unexpected date range.");
    return 0; // Default to SUMMER
  } catch (error) {
    console.error("Error determining IRL season:", error);
    return 0; // Default to SUMMER in case of error
  }
}

// Main mod class
class SouthernHemisphereSeasons implements IPreSptLoadMod {
  preSptLoad(container: DependencyContainer): void {
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const WeatherValues = configServer.getConfig<IWeatherConfig>(
      ConfigTypes.WEATHER
    );

    const staticRouterModService = container.resolve<StaticRouterModService>(
      "StaticRouterModService"
    );

    WeatherValues.overrideSeason = getRealLifeSeason();
    WeatherValues.weather = weatherBySeason[SeasonMap[WeatherValues.overrideSeason]];

    consoleMessages && console.log(
      "Season in game set to:",
      SeasonMap[WeatherValues.overrideSeason]
    );

    // Apply the advanced weather settings if enabled
    enable && staticRouterModService.registerStaticRouter(
      `SouthernHemisphereSeasons`,
      [
        {
          url: "/client/match/offline/end",
          action: async (_url, info, sessionId, output) => {
            WeatherValues.overrideSeason = getRealLifeSeason();
            WeatherValues.weather = weatherBySeason[SeasonMap[WeatherValues.overrideSeason]];

            if (lessFog) {
              WeatherValues.weather.fog.weights = [20, 1, 1, 1, 1];
              consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied less fog setting.");
            }

            if (lessRain) {
              WeatherValues.weather.rain.weights = [5, 1, 1];
              WeatherValues.weather.rainIntensity = { min: 0, max: 0.5 };
              consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied less rain setting.");
            }

            if (clearSkies) {
              WeatherValues.weather.clouds.weights = [30, 1, 1, 1, 1, 1];
              consoleMessages && console.log("[SouthernHemisphereSeasons] : Applied clear skies setting.");
            }

            consoleMessages && console.log(
              `SouthernHemisphereSeasons: Weather settings applied for ${SeasonMap[WeatherValues.overrideSeason]}.`
            );

            return output;
          },
        },
      ],
      "aki"
    );
  }
}

// Export the mod instance
module.exports = { mod: new SouthernHemisphereSeasons() };
