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
const LogTextColor_1 = require("/snapshot/project/obj/models/spt/logging/LogTextColor");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
// import { ItemHelper } from "/snapshot/project/obj/helpers/ItemHelper";
// import { Item } from "/snapshot/project/obj/models/eft/common/tables/IItem";
// import { ITemplateItem } from "/snapshot/project/obj/models/eft/common/tables/ITemplateItem";
class Mod {
    static container;
    database;
    jsonUtil;
    logger;
    futureItemBlacklist;
    config;
    locations;
    //private staticAmmoDists: Map<string, Record<string, IStaticAmmoDetails[]>>;
    staticLootDists;
    configPath = path.resolve(__dirname, "../config/config.json");
    dbPath = path.resolve(__dirname, "../db");
    preAkiLoad(container) {
        const jsonUtil = container.resolve("JsonUtil");
        this.config = jsonUtil.deserialize(fs.readFileSync(this.configPath, "utf-8"), "config.json");
        if (this.config.changeStaticLoot) {
            container.afterResolution("LocationGenerator", (_t, result) => {
                result.generateStaticContainers = (locationBase, staticAmmoDist) => {
                    return this.generateStaticContainers(locationBase, staticAmmoDist);
                };
            }, { frequency: "Always" });
        }
        /*
        if (this.config.changeStaticAmmo) {
            container.afterResolution("ItemHelper", (_t, result: ItemHelper) => {
                result.fillMagazineWithRandomCartridge = (
                    magazine: Item[],
                    magTemplate: ITemplateItem,
                    staticAmmoDist: Record<string, IStaticAmmoDetails[]>,
                    caliber: string = undefined,
                    minSizePercent = 0.25,
                    weapon: ITemplateItem = null
                ) => {
                    return this.fillMagazineWithRandomCartridge(
                        magazine,
                        magTemplate,
                        staticAmmoDist,
                        caliber,
                        minSizePercent,
                        weapon
                    );
                }
            }, { frequency: "Always" });
        }
        */
    }
    postDBLoad(container) {
        Mod.container = container;
        this.database = Mod.container.resolve("DatabaseServer").getTables();
        this.logger = Mod.container.resolve("WinstonLogger");
        this.jsonUtil = Mod.container.resolve("JsonUtil");
        this.locations = new Map();
        this.locations.set("Factory", "factory4_day");
        this.locations.set("FactoryNight", "factory4_night");
        this.locations.set("Customs", "bigmap");
        this.locations.set("Woods", "woods");
        this.locations.set("Shoreline", "shoreline");
        this.locations.set("Interchange", "interchange");
        this.locations.set("Laboratory", "laboratory");
        this.locations.set("ReserveBase", "rezervbase");
        this.locations.set("Lighthouse", "lighthouse");
        this.locations.set("Streets of Tarkov", "tarkovstreets");
        this.locations.set("Sandbox", "sandbox");
        // this.staticAmmoDists = new Map<string, Record<string, IStaticAmmoDetails[]>>();
        this.staticLootDists = new Map();
        this.futureItemBlacklist = [
            "6614217b6d9d5abcad0ff098", // The Unheard's phone - "q_item_phone_unknown"
            "6614230055afee107f05e998", // The Unheard's phone - "q_item_phone_unknown_2"
            "661421c7c1f2f548c50ee649", // The Unheard's laptop - "q_item_toughbook_quest_arr_unknown"
            "661423200d240a5f5d0f679b", // The Unheard's laptop - "q_item_toughbook_quest_arr_2"
            "660bbc47c38b837877075e47", // Encrypted flash drive - "item_flash_card_encrypted"
            "6614238e0d240a5f5d0f679d", // Skier and Peacekeeper correspondence - "item_quest_letter_dialog"
            "661666458c2aa9cb1602503b", // Hard drive - "q_item_disk_quest_arr"
            "66015072e9f84d5680039678", // 20x1mm toy gun - "weapon_ussr_pd_20x1mm"
            "6601546f86889319850bd566", // 20x1mm disk - "patron_20x1mm"
            "66015dc4aaad2f54cb04c56a", // Toy gun 20x1mm 20-round magazine - "mag_pd_ussr_toygun_std_20x1mm_18"
            "66507eabf5ddb0818b085b68", // 2A2-(b-TG) stimulant injector - "2A2-(b-TG)"
            "664a5775f3d3570fba06be64", // Bison VS Undertaker poster pack. - "quest_flyers"
            "664b69c5a082271bc46c4e11", // A pack of Killa and Tagilla posters. - "quest_flyers2"
            "664b69e8e1238e506d3630af", // A pack of 'Easy money on betting' posters - "quest_flyers3"
            "664b69f3a082271bc46c4e13", // quest_flyers4 - "quest_flyers4"
            "664d4b0103ef2c61246afb56", // Dorm overseer key - "Arena_champ_key"
            "664d3db6db5dea2bad286955", // Shatun's hideout - "Arena_woods_key1"
            "664d3dd590294949fe2d81b7", // Grumpy's hideout key - "Arena_interchange_key2"
            "664d3ddfdda2e85aca370d75", // Voron's hideout key - "Arena_shoreline_key3"
            "664d3de85f2355673b09aed5", // Leon's hideout key - "Arena_lighthouse_key4"
            "664fce7a90294949fe2d81cb" // Probably "Compromising information on Ref" - "Item_barter_info_host_quest"
        ];
        this.fixGivingTree();
        this.updateLoot();
        if (this.config.changeStaticLoot) {
            this.logger.log("[Loot Update] Static loot lists generated.", LogTextColor_1.LogTextColor.MAGENTA);
        }
        this.logger.log("[Loot Update] Loot updated. Have a nice day <3", LogTextColor_1.LogTextColor.MAGENTA);
    }
    fixGivingTree() {
        const configServer = Mod.container.resolve("ConfigServer");
        const lootConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOOT);
        // This contains extra spawns for keycards in 3.8.x
        lootConfig.looseLoot.bigmap = [];
    }
    updateLoot() {
        for (const arr of this.locations) {
            const locationName = arr[0];
            const locationId = arr[1];
            const location = this.database.locations[locationId];
            // Update loose loot
            location.looseLoot = this.jsonUtil.deserialize(fs.readFileSync(`${this.dbPath}/${locationId}/looseLoot.json`, "utf-8"));
            this.blacklistLooseLoot(location);
            // Update static containers
            // Don't set static containers for Factory night because it's shared with Factory day.
            if (locationName != "FactoryNight") {
                this.database.loot.staticContainers[locationName] = this.jsonUtil.deserialize(fs.readFileSync(`${this.dbPath}/${locationId}/staticContainers.json`, "utf-8"));
            }
            location.statics = this.jsonUtil.deserialize(fs.readFileSync(`${this.dbPath}/${locationId}/statics.json`, "utf-8"));
            // Generate staticLootDist list
            if (this.config.changeStaticLoot) {
                this.loadStaticLoot(locationId);
            }
        }
    }
    blacklistLooseLoot(location) {
        // For spawnpointsForced (quest items) we remove the whole spawn point if we find a blacklisted item.
        location.looseLoot.spawnpointsForced = location.looseLoot.spawnpointsForced.filter(goodSpawn => goodSpawn.template.Items.find(item => this.futureItemBlacklist.includes(item._tpl)
        // If find(...) === undefined then none of the items matched the blacklist.
        ) === undefined);
        // For spawnPoint we remove the individual itemDist for the blacklisted item because spawnPoints are often shared.
        for (const spawnPoint of location.looseLoot.spawnpoints) {
            spawnPoint.itemDistribution = spawnPoint.itemDistribution.filter(goodItemDist => 
            // itemDist contains a composedKey that matches a template.Items entry. We need to get the Item to compare tpl to blacklist.
            !(this.futureItemBlacklist.includes(spawnPoint.template.Items.find(item => item._id === goodItemDist.composedKey.key)._tpl)));
            // Empty itemDist doesn't stop spawning if IsAlwaysSpawn. Removing spawnPoint would require another loop/filter.
            // This will prevent spawning without significant overhead.
            if (spawnPoint.itemDistribution.length === 0) {
                spawnPoint.template.IsAlwaysSpawn = false;
                // This isn't necessary but prevents a warn for skipping an empty spawn.
                spawnPoint.probability = 0;
            }
        }
    }
    loadStaticLoot(locationId) {
        const location = this.database.locations[locationId];
        /*
        const staticAmmoDist: Record<string, IStaticAmmoDetails[]> = this.jsonUtil.deserialize(
            fs.readFileSync(`${this.dbPath}/${locationId}/staticAmmo.json`, "utf-8"), `${locationId}/staticAmmo.json`
        );
        for (const caliber in staticAmmoDist) {
            staticAmmoDist[caliber] = staticAmmoDist[caliber].filter(goodItems =>
                !(this.futureItemBlacklist.includes(goodItems.tpl))
            )
        }
        // location.base.Id uses different capitalization than the file path ids.
        this.staticAmmoDists.set(location.base.Id, staticAmmoDist);
        */
        const staticLootDist = this.jsonUtil.deserialize(fs.readFileSync(`${this.dbPath}/${locationId}/staticLoot.json`, "utf-8"), `${locationId}/staticLoot.json`);
        for (const containerTypeId in staticLootDist) {
            staticLootDist[containerTypeId].itemDistribution = staticLootDist[containerTypeId].itemDistribution.filter(goodItems => !(this.futureItemBlacklist.includes(goodItems.tpl)));
        }
        // location.base.Id uses different capitalization than the file path ids.
        this.staticLootDists.set(location.base.Id, staticLootDist);
    }
    // LocationGenerator method replacement
    generateStaticContainers(locationBase, staticAmmoDist) {
        const locationGenerator = Mod.container.resolve("LocationGenerator");
        const jsonUtil = Mod.container.resolve("JsonUtil");
        const configServer = Mod.container.resolve("ConfigServer");
        const locationConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        const randomUtil = Mod.container.resolve("RandomUtil");
        const localisationService = Mod.container.resolve("LocalisationService");
        this.logger.log("[Loot Update] Generating static containers.", LogTextColor_1.LogTextColor.MAGENTA);
        // staticAmmoDist gets passed in, but we just overwrite it here to avoid having to patch a separate method. 
        /*
        if (this.config.changeStaticAmmo) {
            staticAmmoDist = this.staticAmmoDists.get(locationBase.Id);
        }
        */
        let staticLootItemCount = 0;
        const result = [];
        const locationId = locationBase.Id.toLowerCase();
        const db = Mod.container.resolve("DatabaseServer").getTables();
        const staticWeaponsOnMapClone = jsonUtil.clone(db.loot.staticContainers[locationBase.Name]?.staticWeapons);
        if (!staticWeaponsOnMapClone) {
            this.logger.error(`Unable to find static weapon data for map: ${locationBase.Name}`);
        }
        // Add mounted weapons to output loot
        result.push(...staticWeaponsOnMapClone ?? []);
        const allStaticContainersOnMapClone = this.jsonUtil.clone(db.loot.staticContainers[locationBase.Name]?.staticContainers);
        if (!allStaticContainersOnMapClone) {
            this.logger.error(`Unable to find static container data for map: ${locationBase.Name}`);
        }
        const staticRandomisableContainersOnMap = locationGenerator.getRandomisableContainersOnMap(allStaticContainersOnMapClone);
        // Containers that MUST be added to map (quest containers etc)
        const staticForcedOnMapClone = this.jsonUtil.clone(db.loot.staticContainers[locationBase.Name]?.staticForced);
        if (!staticForcedOnMapClone) {
            this.logger.error(`Unable to find forced static data for map: ${locationBase.Name}`);
        }
        // Keep track of static loot count
        let staticContainerCount = 0;
        // Find all 100% spawn containers
        // const staticLootDist  = db.loot.staticLoot;
        const staticLootDist = this.staticLootDists.get(locationBase.Id);
        const guaranteedContainers = locationGenerator.getGuaranteedContainers(allStaticContainersOnMapClone);
        staticContainerCount += guaranteedContainers.length;
        // Add loot to guaranteed containers and add to result
        for (const container of guaranteedContainers) {
            const containerWithLoot = locationGenerator.addLootToContainer(container, staticForcedOnMapClone, staticLootDist, staticAmmoDist, locationId);
            result.push(containerWithLoot.template);
            staticLootItemCount += containerWithLoot.template.Items.length;
        }
        this.logger.debug(`Added ${guaranteedContainers.length} guaranteed containers`);
        // Randomisation is turned off globally or just turned off for this map
        if (!(locationConfig.containerRandomisationSettings.enabled
            && locationConfig.containerRandomisationSettings.maps[locationId])) {
            this.logger.debug(`Container randomisation disabled, Adding ${staticRandomisableContainersOnMap.length} containers to ${locationBase.Name}`);
            for (const container of staticRandomisableContainersOnMap) {
                const containerWithLoot = locationGenerator.addLootToContainer(container, staticForcedOnMapClone, staticLootDist, staticAmmoDist, locationId);
                result.push(containerWithLoot.template);
                staticLootItemCount += containerWithLoot.template.Items.length;
            }
            this.logger.success(`A total of ${staticLootItemCount} static items spawned`);
            return result;
        }
        // Group containers by their groupId
        const staticContainerGroupData = db.locations[locationId].statics;
        // const staticContainerGroupData: IStaticContainer = this.statics.get(locationBase.Id);
        if (!staticContainerGroupData) {
            this.logger.warning(`Map: ${locationId} lacks a statics file, skipping container generation.`);
            return result;
        }
        const mapping = locationGenerator.getGroupIdToContainerMappings(staticContainerGroupData, staticRandomisableContainersOnMap);
        // For each of the container groups, choose from the pool of containers, hydrate container with loot and add to result array
        for (const groupId in mapping) {
            const data = mapping[groupId];
            // Count chosen was 0, skip
            if (data.chosenCount === 0) {
                continue;
            }
            if (Object.keys(data.containerIdsWithProbability).length === 0) {
                this.logger.debug(`Group: ${groupId} has no containers with < 100% spawn chance to choose from, skipping`);
                continue;
            }
            // EDGE CASE: These are containers without a group and have a probability < 100%
            if (groupId === "") {
                const containerIdsCopy = this.jsonUtil.clone(data.containerIdsWithProbability);
                // Roll each containers probability, if it passes, it gets added
                data.containerIdsWithProbability = {};
                for (const containerId in containerIdsCopy) {
                    if (randomUtil.getChance100(containerIdsCopy[containerId] * 100)) {
                        data.containerIdsWithProbability[containerId] = containerIdsCopy[containerId];
                    }
                }
                // Set desired count to size of array (we want all containers chosen)
                data.chosenCount = Object.keys(data.containerIdsWithProbability).length;
                // EDGE CASE: chosen container count could be 0
                if (data.chosenCount === 0) {
                    continue;
                }
            }
            // Pass possible containers into function to choose some
            const chosenContainerIds = locationGenerator.getContainersByProbabilty(groupId, data);
            for (const chosenContainerId of chosenContainerIds) {
                // Look up container object from full list of containers on map
                const containerObject = staticRandomisableContainersOnMap.find(staticContainer => staticContainer.template.Id === chosenContainerId);
                if (!containerObject) {
                    this.logger.debug(`Container: ${chosenContainerIds[chosenContainerId]} not found in staticRandomisableContainersOnMap, this is bad`);
                    continue;
                }
                // Add loot to container and push into result object
                const containerWithLoot = locationGenerator.addLootToContainer(containerObject, staticForcedOnMapClone, staticLootDist, staticAmmoDist, locationId);
                result.push(containerWithLoot.template);
                staticContainerCount++;
                staticLootItemCount += containerWithLoot.template.Items.length;
            }
        }
        this.logger.success(`A total of ${staticLootItemCount} static items spawned`);
        this.logger.success(localisationService.getText("location-containers_generated_success", staticContainerCount));
        return result;
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map