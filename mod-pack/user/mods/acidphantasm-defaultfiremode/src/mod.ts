import type { DependencyContainer } from "tsyringe";

import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import type { ItemHelper } from "@spt/helpers/ItemHelper";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

class DefaultFireMode implements IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    
    constructor() {
        this.mod = "DefaultFireMode"; // Set name of mod so we can log it to console later
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] postDBLoad starting... `);
        
        const tables: IDatabaseTables = databaseService.getTables();

        // Get ItemHelper ready to use
        const itemHelper: ItemHelper = container.resolve<ItemHelper>("ItemHelper");

        // Get all items in the database as an array so we can loop over them later
        // tables.templates.items is a dictionary, the key being the items template id, the value being the objects data,
        // we want to convert it into an array so we can loop over all the items easily
        // Object.values lets us grab the 'value' part as an array and ignore the 'key' part
        const items = Object.values(tables.templates.items);

        const weapons = items.filter(x => itemHelper.isOfBaseclass(x._id, BaseClasses.WEAPON));

        // Loop over all the weapons
        for (const weapon of weapons)
        {
            // Check the weapon has a fireType selector property
            if (weapon._props.weapFireType)
            {
                // Re-order the weapFireType based on length
                weapon._props.weapFireType.sort((a, b) => b.length - a.length);

            }
        }
        this.logger.debug(`[${this.mod}] postDBLoad Completed... `);
    }
}

module.exports = { mod: new DefaultFireMode() }