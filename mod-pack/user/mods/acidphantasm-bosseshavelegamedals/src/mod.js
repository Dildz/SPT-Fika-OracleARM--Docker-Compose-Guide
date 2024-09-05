"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const jsonc_1 = __importDefault(require("/snapshot/project/node_modules/jsonc"));
const path_1 = __importDefault(require("path"));
class BossesHaveLegaMedals {
    logger;
    static vfs = tsyringe_1.container.resolve("VFS");
    static config = jsonc_1.default.parse(BossesHaveLegaMedals.vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
    postDBLoad(container) {
        const databaseService = container.resolve("DatabaseService");
        this.logger = container.resolve("WinstonLogger");
        const tables = databaseService.getTables();
        let chance = BossesHaveLegaMedals.config.legaMedalChance;
        if (chance <= 0)
            chance = 1;
        for (const botType in tables.bots.types) {
            if (!botType.includes("boss") || botType == "bosstest") {
                continue;
            }
            const boss = tables.bots.types[botType].inventory.items.Pockets;
            const bossTotal = Object.values(boss).reduce((a, b) => a + b, 0);
            let value = 0;
            let guess = 0;
            let rollChance = 0;
            guess = chance / 100 * bossTotal;
            value = Math.round((chance / 100) * (bossTotal + guess));
            rollChance = value / (bossTotal + value);
            //this.logger.debug(`[BossesHaveLegaMedals] ${botType}: ${(bossTotal + value)} --- if value: ${value} then chance is ${rollChance}`);
            this.logger.debug(`[BossesHaveLegaMedals] ${botType}: Chance is ${Number(rollChance).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}`);
            boss["6656560053eaaa7a23349c86"] = value;
        }
    }
}
exports.mod = new BossesHaveLegaMedals();
//# sourceMappingURL=mod.js.map