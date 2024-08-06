import { DependencyContainer } from "tsyringe";

// SPT types
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ImporterUtil } from "@spt/utils/ImporterUtil";
import { ConfigsModelBase } from "./model/ConfigsModel";

class Mod implements IPostDBLoadMod
{
    private mod: string;
    private logger: ILogger;

    constructor() {
        this.mod = "Wolfiks Heavy Trooper";
    }

    /**
     * Mod post database load
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const importerUtil = container.resolve<ImporterUtil>("ImporterUtil");
        const modImporter = container.resolve<PreSptModLoader>("PreSptModLoader");
        const path = modImporter.getModPath("SerWolfik-Heavy-Troopers");
        const configPath = `${path}db/`;
        const mydb = importerUtil.loadRecursive<ConfigsModelBase>(configPath);
        
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        const locales = tables.locales.global;
        const items = tables.templates.items;

        tables.templates.items["5a154d5cfcdbcb001a3b00da"]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycult"); // FAST MT BLK
		tables.templates.items["5ac8d6885acfc400180ae7b0"]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycult"); // FAST MT TAN
		tables.templates.items["5b432d215acfc4771e1c6624"]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycult"); // LZSH
		tables.templates.items["5ea05cf85ad9772e6624305d"]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycult"); // KEK
		tables.templates.items["5e01ef6886f77445f643baa4"]._props.Slots[1]._props.filters[0].Filter.push("heavycoyote"); // Team Wendy EXFIL Ballistic Helmet (Coyote Tan)
		tables.templates.items["5e00c1ad86f774747333222c"]._props.Slots[1]._props.filters[0].Filter.push("heavycoyote"); // Team Wendy EXFIL Ballistic Helmet (Black)

        for (const item in mydb.templates.items) {
            items[item] = mydb.templates.items[item];
        }
			
		
        for (const item of mydb.traders.assort.assorts.items) {
            tables.traders[mydb.traders.assort.traderId].assort.items.push(item);
        }

        for (const bc in mydb.traders.assort.assorts.barter_scheme) {
            tables.traders[mydb.traders.assort.traderId].assort.barter_scheme[bc] = mydb.traders.assort.assorts.barter_scheme[bc];
        }

        for (const level in mydb.traders.assort.assorts.loyal_level_items) {
            tables.traders[mydb.traders.assort.traderId].assort.loyal_level_items[level] = mydb.traders.assort.assorts.loyal_level_items[level];
        }
		
        for (const item of mydb.templates.handbook.Items) {
            tables.templates.handbook.Items.push(item);
        }

        for (const locale of Object.values(locales)) {
            for (const [itemId, template] of Object.entries(mydb.locales.en.templates)) {
                for (const [key, value] of Object.entries(template)) {
                    locale[`${itemId} ${key}`] = value;
                }
            }
        }

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

export const mod = new Mod();
