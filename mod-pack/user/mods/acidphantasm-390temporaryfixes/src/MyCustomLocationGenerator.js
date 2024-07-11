"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomLocationGenerator = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const LocationGenerator_1 = require("/snapshot/project/obj/generators/LocationGenerator");
const ContainerHelper_1 = require("/snapshot/project/obj/helpers/ContainerHelper");
const ItemHelper_1 = require("/snapshot/project/obj/helpers/ItemHelper");
const PresetHelper_1 = require("/snapshot/project/obj/helpers/PresetHelper");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("/snapshot/project/obj/servers/ConfigServer");
const DatabaseService_1 = require("/snapshot/project/obj/services/DatabaseService");
const ItemFilterService_1 = require("/snapshot/project/obj/services/ItemFilterService");
const LocalisationService_1 = require("/snapshot/project/obj/services/LocalisationService");
const SeasonalEventService_1 = require("/snapshot/project/obj/services/SeasonalEventService");
const ICloner_1 = require("/snapshot/project/obj/utils/cloners/ICloner");
const MathUtil_1 = require("/snapshot/project/obj/utils/MathUtil");
const ObjectId_1 = require("/snapshot/project/obj/utils/ObjectId");
const RandomUtil_1 = require("/snapshot/project/obj/utils/RandomUtil");
/** Handle profile related client events */
let MyCustomLocationGenerator = class MyCustomLocationGenerator extends LocationGenerator_1.LocationGenerator {
    logger;
    databaseService;
    objectId;
    randomUtil;
    itemHelper;
    mathUtil;
    seasonalEventService;
    containerHelper;
    presetHelper;
    localisationService;
    itemFilterService;
    configServer;
    cloner;
    constructor(logger, databaseService, objectId, randomUtil, itemHelper, mathUtil, seasonalEventService, containerHelper, presetHelper, localisationService, itemFilterService, configServer, cloner) {
        // Pass the parent class (LauncherCallbacks) the dependencies it needs to work
        super(logger, databaseService, objectId, randomUtil, itemHelper, mathUtil, seasonalEventService, containerHelper, presetHelper, localisationService, itemFilterService, configServer, cloner);
        this.logger = logger;
        this.databaseService = databaseService;
        this.objectId = objectId;
        this.randomUtil = randomUtil;
        this.itemHelper = itemHelper;
        this.mathUtil = mathUtil;
        this.seasonalEventService = seasonalEventService;
        this.containerHelper = containerHelper;
        this.presetHelper = presetHelper;
        this.localisationService = localisationService;
        this.itemFilterService = itemFilterService;
        this.configServer = configServer;
        this.cloner = cloner;
    }
    generateDynamicLoot(dynamicLootDist, staticAmmoDist, locationName) {
        const loot = [];
        const dynamicForcedSpawnPoints = [];
        // Build the list of forced loot from both `spawnpointsForced` and any point marked `IsAlwaysSpawn`
        dynamicForcedSpawnPoints.push(...dynamicLootDist.spawnpointsForced);
        dynamicForcedSpawnPoints.push(...dynamicLootDist.spawnpoints.filter((point) => point.template.IsAlwaysSpawn));
        // Add forced loot
        this.addForcedLoot(loot, dynamicForcedSpawnPoints, locationName);
        const allDynamicSpawnpoints = dynamicLootDist.spawnpoints;
        // Draw from random distribution
        const desiredSpawnpointCount = Math.round(this.getLooseLootMultiplerForLocation(locationName)
            * this.randomUtil.getNormallyDistributedRandomNumber(dynamicLootDist.spawnpointCount.mean, dynamicLootDist.spawnpointCount.std));
        // Positions not in forced but have 100% chance to spawn
        const guaranteedLoosePoints = [];
        const blacklistedSpawnpoints = this.locationConfig.looseLootBlacklist[locationName];
        const spawnpointArray = new RandomUtil_1.ProbabilityObjectArray(this.mathUtil, this.cloner);
        for (const spawnpoint of allDynamicSpawnpoints) {
            // Point is blacklsited, skip
            if (blacklistedSpawnpoints?.includes(spawnpoint.template.Id)) {
                this.logger.debug(`Ignoring loose loot location: ${spawnpoint.template.Id}`);
                continue;
            }
            // We've handled IsAlwaysSpawn above, so skip them
            if (spawnpoint.template.IsAlwaysSpawn) {
                continue;
            }
            // 100%, add it to guaranteed
            if (spawnpoint.probability === 1) {
                guaranteedLoosePoints.push(spawnpoint);
                continue;
            }
            spawnpointArray.push(new RandomUtil_1.ProbabilityObject(spawnpoint.template.Id, spawnpoint.probability, spawnpoint));
        }
        // Select a number of spawn points to add loot to
        // Add ALL loose loot with 100% chance to pool
        let chosenSpawnpoints = [...guaranteedLoosePoints];
        const randomSpawnpointCount = desiredSpawnpointCount - chosenSpawnpoints.length;
        // Only draw random spawn points if needed
        if (randomSpawnpointCount > 0 && spawnpointArray.length > 0) {
            // Add randomly chosen spawn points
            for (const si of spawnpointArray.draw(randomSpawnpointCount, false)) {
                chosenSpawnpoints.push(spawnpointArray.data(si));
            }
        }
        // Filter out duplicate locationIds
        chosenSpawnpoints = [
            ...new Map(chosenSpawnpoints.map((spawnPoint) => [spawnPoint.locationId, spawnPoint])).values(),
        ];
        // Do we have enough items in pool to fulfill requirement
        const tooManySpawnPointsRequested = desiredSpawnpointCount - chosenSpawnpoints.length > 0;
        if (tooManySpawnPointsRequested) {
            this.logger.debug(this.localisationService.getText("location-spawn_point_count_requested_vs_found", {
                requested: desiredSpawnpointCount + guaranteedLoosePoints.length,
                found: chosenSpawnpoints.length,
                mapName: locationName,
            }));
        }
        // Iterate over spawnpoints
        const seasonalEventActive = this.seasonalEventService.seasonalEventEnabled();
        const seasonalItemTplBlacklist = this.seasonalEventService.getInactiveSeasonalEventItems();
        for (const spawnPoint of chosenSpawnpoints) {
            // Spawnpoint is invalid, skip it
            if (!spawnPoint.template) {
                this.logger.warning(this.localisationService.getText("location-missing_dynamic_template", spawnPoint.locationId));
                continue;
            }
            // Ensure no blacklisted lootable items are in pool
            spawnPoint.template.Items = spawnPoint.template.Items
                .filter((item) => !this.itemFilterService.isLootableItemBlacklisted(item._tpl));
            // Ensure no seasonal items are in pool if not in-season
            if (!seasonalEventActive) {
                spawnPoint.template.Items = spawnPoint.template.Items
                    .filter((item) => !seasonalItemTplBlacklist.includes(item._tpl));
            }
            // Spawn point has no items after filtering, skip
            if (!spawnPoint.template.Items || spawnPoint.template.Items.length === 0) {
                this.logger.warning(this.localisationService.getText("location-spawnpoint_missing_items", spawnPoint.template.Id));
                continue;
            }
            // Get an array of allowed IDs after above filtering has occured
            const validItemIds = spawnPoint.template.Items.map((item) => item._id);
            // Construct container to hold above filtered items, letting us pick an item for the spot
            const itemArray = new RandomUtil_1.ProbabilityObjectArray(this.mathUtil, this.cloner);
            for (const itemDist of spawnPoint.itemDistribution) {
                if (!validItemIds.includes(itemDist.composedKey.key)) {
                    continue;
                }
                itemArray.push(new RandomUtil_1.ProbabilityObject(itemDist.composedKey.key, itemDist.relativeProbability));
            }
            if (itemArray.length === 0) {
                this.logger.warning(this.localisationService.getText("location-loot_pool_is_empty_skipping", spawnPoint.template.Id));
                continue;
            }
            // Draw a random item from spawn points possible items
            const chosenComposedKey = itemArray.draw(1)[0];
            const createItemResult = this.createDynamicLootItem(chosenComposedKey, spawnPoint, staticAmmoDist);
            // Root id can change when generating a weapon, ensure ids match
            spawnPoint.template.Root = createItemResult.items[0]._id;
            // Overwrite entire pool with chosen item
            spawnPoint.template.Items = createItemResult.items;
            loot.push(spawnPoint.template);
        }
        return loot;
    }
};
exports.MyCustomLocationGenerator = MyCustomLocationGenerator;
exports.MyCustomLocationGenerator = MyCustomLocationGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("ObjectId")),
    __param(3, (0, tsyringe_1.inject)("RandomUtil")),
    __param(4, (0, tsyringe_1.inject)("ItemHelper")),
    __param(5, (0, tsyringe_1.inject)("MathUtil")),
    __param(6, (0, tsyringe_1.inject)("SeasonalEventService")),
    __param(7, (0, tsyringe_1.inject)("ContainerHelper")),
    __param(8, (0, tsyringe_1.inject)("PresetHelper")),
    __param(9, (0, tsyringe_1.inject)("LocalisationService")),
    __param(10, (0, tsyringe_1.inject)("ItemFilterService")),
    __param(11, (0, tsyringe_1.inject)("ConfigServer")),
    __param(12, (0, tsyringe_1.inject)("PrimaryCloner")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof ObjectId_1.ObjectId !== "undefined" && ObjectId_1.ObjectId) === "function" ? _c : Object, typeof (_d = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _d : Object, typeof (_e = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _e : Object, typeof (_f = typeof MathUtil_1.MathUtil !== "undefined" && MathUtil_1.MathUtil) === "function" ? _f : Object, typeof (_g = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _g : Object, typeof (_h = typeof ContainerHelper_1.ContainerHelper !== "undefined" && ContainerHelper_1.ContainerHelper) === "function" ? _h : Object, typeof (_j = typeof PresetHelper_1.PresetHelper !== "undefined" && PresetHelper_1.PresetHelper) === "function" ? _j : Object, typeof (_k = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _k : Object, typeof (_l = typeof ItemFilterService_1.ItemFilterService !== "undefined" && ItemFilterService_1.ItemFilterService) === "function" ? _l : Object, typeof (_m = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _m : Object, typeof (_o = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _o : Object])
], MyCustomLocationGenerator);
//# sourceMappingURL=MyCustomLocationGenerator.js.map