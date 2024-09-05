import { container, DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseService } from "@spt/services/DatabaseService";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import jsonc from "jsonc";
import path from "path";
import { VFS } from "@spt/utils/VFS";

class BossesHaveLegaMedals implements IPostDBLoadMod
{
    private logger: ILogger

    private static vfs = container.resolve<VFS>("VFS");    
    private static config: Config = jsonc.parse(BossesHaveLegaMedals.vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

    public postDBLoad(container: DependencyContainer): void
    {
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const tables: IDatabaseTables = databaseService.getTables();

        let chance = BossesHaveLegaMedals.config.legaMedalChance;
        if (chance <= 0) chance = 1;

        for (const botType in tables.bots.types)
        {
            if (!botType.includes("boss") || botType == "bosstest")
            {
                continue;
            }
            const boss = tables.bots.types[botType].inventory.items.Pockets;
            const bossTotal = Object.values(boss).reduce((a, b) => a + b, 0);

            let value = 0;
            let guess = 0;
            let rollChance = 0;

            guess = chance / 100 * bossTotal;
            value = Math.round((chance / 100) * (bossTotal + guess));
            rollChance = value / (bossTotal + value)
            //this.logger.debug(`[BossesHaveLegaMedals] ${botType}: ${(bossTotal + value)} --- if value: ${value} then chance is ${rollChance}`);
            this.logger.debug(`[BossesHaveLegaMedals] ${botType}: Chance is ${Number(rollChance).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}`);
            boss["6656560053eaaa7a23349c86"] = value;
        }
    }
}

interface Config 
{
    legaMedalChance: number,
}

export const mod = new BossesHaveLegaMedals();
