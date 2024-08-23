"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationUpdater = void 0;
const GlobalValues_1 = require("./GlobalValues");
const config_json_1 = require("../../config/config.json");
const LocationUpdater = (container) => {
    const staticRouterModService = container.resolve("StaticRouterModService");
    const weatherController = container.resolve("WeatherController");
    staticRouterModService.registerStaticRouter(`AlgorithmicLevelProgressionMapUpdater`, [
        {
            url: "/client/raid/configuration",
            action: async (_url, info, sessionId, output) => {
                const time = weatherController.generate().time;
                const hours = getTime(time, info.timeVariant === "PAST" ? 12 : 0);
                GlobalValues_1.globalValues.setValuesForLocation(info.location.toLowerCase(), hours);
                if (config_json_1.enableNonPMCBotChanges) {
                    const pmcData = GlobalValues_1.globalValues.profileHelper.getPmcProfile(sessionId);
                    GlobalValues_1.globalValues.updateInventory(pmcData?.Info?.Level || 1);
                }
                console.log("Algorthimic LevelProgression: Loaded");
                return output;
            },
        },
    ], "aki");
    GlobalValues_1.globalValues.config.debug &&
        console.log("Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered");
};
exports.LocationUpdater = LocationUpdater;
function getTime(time, hourDiff) {
    let [h, m] = time.split(":");
    // console.log("minutes", m)
    if (parseInt(h) == 0) {
        return Number(h);
    }
    return Number(Math.abs(parseInt(h) - hourDiff));
}
//# sourceMappingURL=LocationUpdater.js.map