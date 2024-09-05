import { DependencyContainer } from "tsyringe";

// SPT types
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ImporterUtil } from "@spt/utils/ImporterUtil";
import { ConfigsModelBase } from "./model/ConfigsModel";

import { VFS } from "@spt/utils/VFS";
import { jsonc } from "jsonc";

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
        const path = modImporter.getModPath("zSerWolfik-Heavy-Troopers");
        const configPath = `${path}db/`;
        const mydb = importerUtil.loadRecursive<ConfigsModelBase>(configPath);

        // Config setup
        const vfs = container.resolve<VFS>("VFS")
        let config = jsonc.parse(vfs.readFile(path + "/config/config.jsonc"))

        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        const locales = tables.locales.global;
        const items = tables.templates.items;

        const STANDARD_HELMETS = ['5a154d5cfcdbcb001a3b00da', '5ac8d6885acfc400180ae7b0', '5b432d215acfc4771e1c6624', '5ea05cf85ad9772e6624305d', '5e01ef6886f77445f643baa4', '5e00c1ad86f774747333222c'];
        const TROOPER_MASKS = ["heavy", "heavytan", "heavyblack", "heavycoyote", "heavycult"];
        const TGC_HELMETS_MODX_2 = ['CCG_MODX_2_HELMET_M90', 'CCG_MODX_2_HELMET_BLK', 'CCG_MODX_2_HELMET_MULTI',];
        const TGC_HELMETS_MODX = ['CCG_MODX_HELMET', 'CCG_MODX_HELMET_BLK'];
        const ARTEM_HELMETS = ['66326bfd46817c660d015126', '66326bfd46817c660d015128', '66326bfd46817c660d015129', '66326bfd46817c660d01512a', '66326bfd46817c660d01512d', '66326bfd46817c660d015133', '66326bfd46817c660d01514c', '669819683571cb050b0b6393', '669819683571cb050b0b6394','66326bfd46817c660d015125', '66326bfd46817c660d015127'];
        const MODDED_NVGS = ['66326bfd46817c660d01512e', '66326bfd46817c660d015148', '66326bfd46817c660d015146', //ARTEM
            '4D4341544C41534745415206' // ATLAS
        ];
    

        // Modded helmets compatibility
        for (const helmet of TGC_HELMETS_MODX_2) {
            if (tables.templates.items[helmet]) {
                tables.templates.items[helmet]._props.Slots[2]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycoyote","heavycult");
            }
        }

        for (const helmet of TGC_HELMETS_MODX) {
            if (tables.templates.items[helmet]) {
                tables.templates.items[helmet]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycoyote","heavycult");
            }
        }

        for (const helmet of ARTEM_HELMETS) {
            if (tables.templates.items[helmet]) {
                tables.templates.items[helmet]._props.Slots[0]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycoyote","heavycult");
            }
        }

        // Begin adding items to the game
        for (const helmet of STANDARD_HELMETS) {
            tables.templates.items[helmet]._props.Slots[1]._props.filters[0].Filter.push("heavy","heavytan","heavyblack","heavycoyote","heavycult");
        }

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

        // Modded nvgs compatibility
        for (const nvg of MODDED_NVGS) {
            for (const mask of TROOPER_MASKS) {
                tables.templates.items[mask]._props.Slots[0]._props.filters[0].Filter.push(nvg);
            }
        }

        const maps = [
            "bigmap",     // customs
            "factory4_day",
            "factory4_night",
            "woods",
            "rezervbase",
            "shoreline",
            "interchange",
            "tarkovstreets",
            "lighthouse",
            "laboratory",
            "sandbox",    // groundzero
            "sandbox_high"
        ];

        for (const item in config.probabilities) {
            //console.log(config.probabilities[item])
            for(const map of maps){
                const mapStaticLoot = tables.locations[map].staticLoot;
                const staticLootProbabilities = config.probabilities[item];
                for(const [lootContainer, probability] of Object.entries(staticLootProbabilities)){

                    try{
                        mapStaticLoot[lootContainer].itemDistribution.push({
                            "tpl": item,
                            "relativeProbability": probability
                        });
                    } catch (e){
                        this.logger.debug("Could not add " + item + " to container " + lootContainer + " on map " + map)
                    }

                }
            }
                

        }
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

export const mod = new Mod();
