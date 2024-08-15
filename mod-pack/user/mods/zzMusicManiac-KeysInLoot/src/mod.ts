import { DependencyContainer } from "tsyringe";
import { Ilogger } from "@spt/models/spt/utils/Ilogger";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { BaseClasses } from  "@spt/models/enums/BaseClasses";

import { VFS } from "@spt/utils/VFS";
import { jsonc } from "jsonc";
import path from "path";

class KeysInLoot implements IPostDBLoadMod
{
	private logger: Ilogger;
	public mod: string;
    public modShortName: string;

	constructor() {
        this.mod = "MusicManiac-KeysInLoot";
        this.modShortName = "KeysInLoot";
    }

	public postDBLoad ( container: DependencyContainer ): void 
	{
		this.logger = container.resolve<Ilogger>("WinstonLogger");
		const logger = this.logger;
		logger.info(`[${this.modShortName}] ${this.mod} started loading`);

		const itemHelper = container.resolve<ItemHelper>("ItemHelper");

		const db = container.resolve<DatabaseServer>("DatabaseServer");
		
		const vfs = container.resolve<VFS>("VFS");
		const config = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config.jsonc")));

		let tables = db.getTables();
		const itemDB = tables.templates.items;
		const handbookPrices = tables.templates.handbook.Items;
		const fleaPrices = tables.templates.prices;
		let keys: string[] = [];

		for (let item in itemDB) {
			const itemId = itemDB[item]._id;
			//
			if (itemDB[item]._type == "Item") {
				if ((itemHelper.isOfBaseclass(itemId, BaseClasses.KEY_MECHANICAL) && config.keyWeight !== 0)
					|| (itemHelper.isOfBaseclass(itemId, BaseClasses.KEYCARD) && config.keycardWeight !== 0)) {
						keys.push(itemId);
						const itemToModify = handbookPrices.find(item => item.Id === itemId);
						if (itemToModify) {
							itemToModify.Price = Math.round(itemToModify.Price * config.keyTraderPricesMultiplier);
						}
						if (fleaPrices[itemId]) {
							fleaPrices[itemId] = Math.round(fleaPrices[itemId] * config.keyFleaPricesMultiplier);
						}	
				}
			}
		}

		let adjustedWeights = 0;
		let addedKeys = 0;

		const maps = ["bigmap", "factory4_day", "factory4_night", "interchange", "laboratory", "lighthouse", "rezervbase", "sandbox", "sandbox_high", "shoreline", "tarkovstreets", "woods"];

		for (const map of maps) {
			if (config.keyWeight !== 0) {
				for (const key of keys) {
					try {
						if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f8778245977358849a9b5"]) {
							const jacket = tables.locations[map].staticLoot["578f8778245977358849a9b5"];
							const foundKeyJacket = jacket.itemDistribution.find(item => item.tpl === key);
							if (foundKeyJacket) {
								if (foundKeyJacket.relativeProbability < config.keyWeight) {
									foundKeyJacket.relativeProbability = config.keyWeight;
									adjustedWeights++;
								}
							} else {
								jacket.itemDistribution.push({
									tpl: key,
									relativeProbability: config.keyWeight
								});
								addedKeys++;
							}
							jacket.itemcountDistribution = config.overRideLootDistributionJackets;
						}
					} catch (error) {
						console.error(`Error processing jacket on map ${map}`, error);
					}
					
					try {
						if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f87a3245977356274f2cb"]) {
							const duffleBag = tables.locations[map].staticLoot["578f87a3245977356274f2cb"];
							const foundKeyDuffle = duffleBag.itemDistribution.find(item => item.tpl === key);
							if (foundKeyDuffle) {
								if (foundKeyDuffle.relativeProbability < config.keyWeight) {
									foundKeyDuffle.relativeProbability = config.keyWeight;
									adjustedWeights++;
								}
							} else {
								duffleBag.itemDistribution.push({
									tpl: key,
									relativeProbability: config.keyWeight
								});
								addedKeys++;
							}
							duffleBag.itemcountDistribution = config.overRideLootDistributionDuffleBags;
						}
					} catch (error) {
						console.error(`Error processing dufflebag on map ${map}`, error);
					}

					try {
						if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"]) {
							const deadScav = tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"];
							const foundDeadScav = deadScav.itemDistribution.find(item => item.tpl === key);
							if (foundDeadScav) {
								if (foundDeadScav.relativeProbability < config.keyWeight) {
									foundDeadScav.relativeProbability = config.keyWeight;
									adjustedWeights++;
								}
							} else {
								deadScav.itemDistribution.push({
									tpl: key,
									relativeProbability: config.keyWeight
								});
								addedKeys++;
							}
							deadScav.itemcountDistribution = config.overRideLootDistributionDeadScavs;
						}
					} catch (error) {
						console.error(`Error processing deadScav on map ${map}`, error);
					}

					
				}
			}
		}	

		logger.info(`[${this.modShortName}] ${adjustedWeights} keys weights were adjusted`);
		logger.info(`[${this.modShortName}] different keys were added ${addedKeys} times to jacket/duffle/dead scav loot`);

		itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsH = config.cellsH;
		itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsV = config.cellsV;


		logger.success(`[${this.modShortName}] ${this.mod} finished loading`);
	}
}

module.exports = { mod: new KeysInLoot() }