"use strict";
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
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
class Mod {
    static container;
    static updateTimer;
    static config;
    static configPath = path.resolve(__dirname, "../config/config.json");
    static achievementDataPath = path.resolve(__dirname, "../config/achievement.json");
    preSptLoad(container) {
        const staticRouterModService = container.resolve("StaticRouterModService");
        // Hook up to existing SPT static route
        staticRouterModService.registerStaticRouter("StaticRoutePeekingClientAchievementStatic", [
            {
                url: "/client/achievement/statistic",
                action: (url, info, sessionId, output) => {
                    // Fetch the achievements from the file and add them to the output.
                    const result = JSON.parse(output);
                    const achievements = JSON.parse(fs.readFileSync(Mod.achievementDataPath, "utf-8"));
                    const stats = {};
                    for (const achievement of achievements) {
                        stats[achievement.id] = achievement.playersCompletedPercent;
                    }
                    result.data.elements = stats;
                    return JSON.stringify(result);
                }
            }
        ], "custom_client_achievement_static");
    }
    async postDBLoadAsync(container) {
        Mod.container = container;
        // Try to load the config file
        try {
            const configData = await fs.promises.readFile(Mod.configPath, "utf-8");
            Mod.config = JSON.parse(configData);
        }
        catch (error) {
            console.error("Failed to read config file:", error);
            return;
        }
        // Update achievements if needed
        const currentTime = Math.floor(Date.now() / 1000);
        const fetchAchievements = currentTime > Mod.config.nextUpdate;
        if (await Mod.updateAchievements(fetchAchievements)) {
            Mod.updateTimer = setInterval(() => Mod.updateAchievements(), Mod.config.updateIntervalInHours * 3600000);
        }
    }
    static async updateAchievements(fetchAchievements = true) {
        const logger = Mod.container.resolve("WinstonLogger");
        // Fetch achievements data if needed
        if (fetchAchievements || !fs.existsSync(Mod.achievementDataPath)) {
            logger.info("Fetching achievements data...");
            try {
                const response = await fetch('https://api.tarkov.dev/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ query: `{
                        achievements {
                            id
                            rarity
                            playersCompletedPercent
                        }
                    }` })
                });
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(`Error fetching achievements data: ${response.status} (${response.statusText})`);
                }
                // Get the data fromt the response and write it to the file
                const { data } = await response.json();
                const achievements = data.achievements;
                await fs.promises.writeFile(Mod.achievementDataPath, JSON.stringify(achievements));
                Mod.config.nextUpdate = Math.floor(Date.now() / 1000) + (Mod.config.updateIntervalInHours * 3600);
                await fs.promises.writeFile(Mod.configPath, JSON.stringify(Mod.config, null, 4));
            }
            catch (error) {
                logger.error(error.message);
                clearInterval(Mod.updateTimer);
                return false;
            }
        }
        logger.info("Achievements Updated.");
        return true;
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map