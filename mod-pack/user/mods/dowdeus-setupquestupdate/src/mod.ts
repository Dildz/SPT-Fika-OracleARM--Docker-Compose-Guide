import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();

        // Find the setup quest by its Id
        const setupQuest = tables.templates.quests["5c1234c286f77406fa13baeb"];

        // Update its total value to be 8 as of 15.0
        setupQuest.conditions.AvailableForFinish.map((quest) => 
        {
            quest.value = 8;
        });

       
    }
}

export const mod = new Mod();
