import { inject, injectable } from "tsyringe";


import { LocationGenerator } from "@spt/generators/LocationGenerator";
import { ContainerHelper } from "@spt/helpers/ContainerHelper";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { PresetHelper } from "@spt/helpers/PresetHelper";
import { IStaticAmmoDetails } from "@spt/models/eft/common/ILocation";
import { ILooseLoot, SpawnpointTemplate, SpawnpointsForced, Spawnpoint } from "@spt/models/eft/common/ILooseLoot";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ItemFilterService } from "@spt/services/ItemFilterService";
import { LocalisationService } from "@spt/services/LocalisationService";
import { SeasonalEventService } from "@spt/services/SeasonalEventService";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { MathUtil } from "@spt/utils/MathUtil";
import { ObjectId } from "@spt/utils/ObjectId";
import { RandomUtil, ProbabilityObjectArray, ProbabilityObject } from "@spt/utils/RandomUtil";

/** Handle profile related client events */
@injectable()
export class MyCustomLocationGenerator extends LocationGenerator
{
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("ObjectId") protected objectId: ObjectId,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("MathUtil") protected mathUtil: MathUtil,
        @inject("SeasonalEventService") protected seasonalEventService: SeasonalEventService,
        @inject("ContainerHelper") protected containerHelper: ContainerHelper,
        @inject("PresetHelper") protected presetHelper: PresetHelper,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("ItemFilterService") protected itemFilterService: ItemFilterService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("PrimaryCloner") protected cloner: ICloner,
    )
    {
        // Pass the parent class (LauncherCallbacks) the dependencies it needs to work
        super(logger, 
            databaseService, 
            objectId, 
            randomUtil, 
            itemHelper, 
            mathUtil, 
            seasonalEventService, 
            containerHelper, 
            presetHelper, 
            localisationService, 
            itemFilterService, 
            configServer, cloner);
    }

    public override generateDynamicLoot(
        dynamicLootDist: ILooseLoot,
        staticAmmoDist: Record<string, IStaticAmmoDetails[]>,
        locationName: string,
    ): SpawnpointTemplate[]
    {
        const loot: SpawnpointTemplate[] = [];
        const dynamicForcedSpawnPoints: SpawnpointsForced[] = [];

        // Build the list of forced loot from both `spawnpointsForced` and any point marked `IsAlwaysSpawn`
        dynamicForcedSpawnPoints.push(...dynamicLootDist.spawnpointsForced);
        dynamicForcedSpawnPoints.push(...dynamicLootDist.spawnpoints.filter((point) => point.template.IsAlwaysSpawn));

        // Add forced loot
        this.addForcedLoot(loot, dynamicForcedSpawnPoints, locationName);

        const allDynamicSpawnpoints = dynamicLootDist.spawnpoints;

        // Draw from random distribution
        const desiredSpawnpointCount = Math.round(
            this.getLooseLootMultiplerForLocation(locationName)
            * this.randomUtil.getNormallyDistributedRandomNumber(
                dynamicLootDist.spawnpointCount.mean,
                dynamicLootDist.spawnpointCount.std,
            ),
        );

        // Positions not in forced but have 100% chance to spawn
        const guaranteedLoosePoints: Spawnpoint[] = [];

        const blacklistedSpawnpoints = this.locationConfig.looseLootBlacklist[locationName];
        const spawnpointArray = new ProbabilityObjectArray<string, Spawnpoint>(this.mathUtil, this.cloner);

        for (const spawnpoint of allDynamicSpawnpoints)
        {
            // Point is blacklsited, skip
            if (blacklistedSpawnpoints?.includes(spawnpoint.template.Id))
            {
                this.logger.debug(`Ignoring loose loot location: ${spawnpoint.template.Id}`);
                continue;
            }

            // We've handled IsAlwaysSpawn above, so skip them
            if (spawnpoint.template.IsAlwaysSpawn)
            {
                continue;
            }

            // 100%, add it to guaranteed
            if (spawnpoint.probability === 1)
            {
                guaranteedLoosePoints.push(spawnpoint);
                continue;
            }

            spawnpointArray.push(new ProbabilityObject(spawnpoint.template.Id, spawnpoint.probability, spawnpoint));
        }

        // Select a number of spawn points to add loot to
        // Add ALL loose loot with 100% chance to pool
        let chosenSpawnpoints: Spawnpoint[] = [...guaranteedLoosePoints];

        const randomSpawnpointCount = desiredSpawnpointCount - chosenSpawnpoints.length;
        // Only draw random spawn points if needed
        if (randomSpawnpointCount > 0 && spawnpointArray.length > 0)
        {
            // Add randomly chosen spawn points
            for (const si of spawnpointArray.draw(randomSpawnpointCount, false))
            {
                chosenSpawnpoints.push(spawnpointArray.data(si)!);
            }
        }

        // Filter out duplicate locationIds
        chosenSpawnpoints = [
            ...new Map(chosenSpawnpoints.map((spawnPoint) => [spawnPoint.locationId, spawnPoint])).values(),
        ];

        // Do we have enough items in pool to fulfill requirement
        const tooManySpawnPointsRequested = desiredSpawnpointCount - chosenSpawnpoints.length > 0;
        if (tooManySpawnPointsRequested)
        {
            this.logger.debug(
                this.localisationService.getText("location-spawn_point_count_requested_vs_found", {
                    requested: desiredSpawnpointCount + guaranteedLoosePoints.length,
                    found: chosenSpawnpoints.length,
                    mapName: locationName,
                }),
            );
        }

        // Iterate over spawnpoints
        const seasonalEventActive = this.seasonalEventService.seasonalEventEnabled();
        const seasonalItemTplBlacklist = this.seasonalEventService.getInactiveSeasonalEventItems();
        for (const spawnPoint of chosenSpawnpoints)
        {
            // Spawnpoint is invalid, skip it
            if (!spawnPoint.template)
            {
                this.logger.warning(
                    this.localisationService.getText("location-missing_dynamic_template", spawnPoint.locationId),
                );

                continue;
            }

            // Ensure no blacklisted lootable items are in pool
            spawnPoint.template.Items = spawnPoint.template.Items
                .filter((item) => !this.itemFilterService.isLootableItemBlacklisted(item._tpl));

            // Ensure no seasonal items are in pool if not in-season
            if (!seasonalEventActive)
            {
                spawnPoint.template.Items = spawnPoint.template.Items
                    .filter((item) => !seasonalItemTplBlacklist.includes(item._tpl));
            }

            // Spawn point has no items after filtering, skip
            if (!spawnPoint.template.Items || spawnPoint.template.Items.length === 0)
            {
                this.logger.warning(
                    this.localisationService.getText("location-spawnpoint_missing_items", spawnPoint.template.Id),
                );

                continue;
            }

            // Get an array of allowed IDs after above filtering has occured
            const validItemIds = spawnPoint.template.Items.map((item) => item._id);

            // Construct container to hold above filtered items, letting us pick an item for the spot
            const itemArray = new ProbabilityObjectArray<string>(this.mathUtil, this.cloner);
            for (const itemDist of spawnPoint.itemDistribution)
            {
                if (!validItemIds.includes(itemDist.composedKey.key))
                {
                    continue;
                }

                itemArray.push(new ProbabilityObject(itemDist.composedKey.key, itemDist.relativeProbability));
            }

            if (itemArray.length === 0)
            {
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
}
