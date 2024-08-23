"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
class Mod {
    postDBLoad(container) {
        // get database from server
        const databaseServer = container.resolve("DatabaseServer");
        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
        // Find the setup quest by its Id
        const setupQuest = tables.templates.quests["5c1234c286f77406fa13baeb"];
        // Update its total value to be 8 as of 15.0
        setupQuest.conditions.AvailableForFinish.map((quest) => {
            quest.value = 8;
        });
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map