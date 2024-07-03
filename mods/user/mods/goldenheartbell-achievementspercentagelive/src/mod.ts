import type { DependencyContainer } from "tsyringe";

import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { IPostDBLoadModAsync } from "@spt-aki/models/external/IPostDBLoadModAsync";
import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import * as fs from "node:fs";
import * as path from "node:path";

class Mod implements IPreAkiLoadMod, IPostDBLoadModAsync
{
    private static container: DependencyContainer;
    private static updateTimer: NodeJS.Timeout;
    private static config: Config;
    private static configPath = path.resolve(__dirname, "../config/config.json");
    private static achievementDataPath = path.resolve(__dirname, "../config/achievement.json");

    public preAkiLoad(container: DependencyContainer): void {
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        // Hook up to existing SPT static route
        staticRouterModService.registerStaticRouter(
            "StaticRoutePeekingClientAchievementStatic",
            [
                {
                    url: "/client/achievement/statistic",
                    action: (url, info, sessionId, output) =>
                    {
                        // Fetch the achievements from the file and add them to the output.
                        const result = JSON.parse(output);
                        const achievements = JSON.parse(fs.readFileSync(Mod.achievementDataPath, "utf-8"));
                        const stats = {};

                        for (const achievement of achievements)
                        {
                            stats[achievement.id] = achievement.playersCompletedPercent;
                        }
                        
                        result.data.elements = stats;
                        return JSON.stringify(result);
                    }
                }
            ],
            "custom_client_achievement_static"
        );
    }

    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        Mod.container = container;
        
        // Try to load the config file
        try {
            const configData = await fs.promises.readFile(Mod.configPath, "utf-8");
            Mod.config = JSON.parse(configData);
        } catch (error) {
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

    static async updateAchievements(fetchAchievements = true): Promise<boolean> {
        const logger = Mod.container.resolve<ILogger>("WinstonLogger");
        
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
            } catch (error) {
                logger.error(error.message);
                clearInterval(Mod.updateTimer);
                return false;
            }
        }
        
        logger.info("Achievements Updated.");
        return true;
    }
}

interface Config 
{
    nextUpdate: number,
    updateIntervalInHours: number
}

module.exports = { mod: new Mod() }
