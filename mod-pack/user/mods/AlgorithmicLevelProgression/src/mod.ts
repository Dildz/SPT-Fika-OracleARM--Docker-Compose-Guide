import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import BotLevelChanges from "./LevelChanges/BotLevelChanges";
import {
  enableProgressionChanges,
  enableLevelChanges,
  enableNonPMCBotChanges,
  leveledClothing,
} from "../config/config.json";
import ProgressionChanges from "./LoadoutChanges/ProgressionChanges";
import { SetupLocationGlobals } from "./LoadoutChanges/SetupLocationGlobals";
import { LocationUpdater } from "./LoadoutChanges/LocationUpdater";
import SetupNonPMCBotChanges from "./NonPmcBotChanges/SetupNonPMCBotChanges";
import ClothingChanges from "./LoadoutChanges/ClothingChanges";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class AlgorithmicLevelProgression
  implements IPreSptLoadMod, IPostDBLoadMod, IPostSptLoadMod
{
  preSptLoad(container: DependencyContainer): void {
    enableLevelChanges && BotLevelChanges(container);
    enableProgressionChanges && LocationUpdater(container);
  }

  postDBLoad(container: DependencyContainer): void {
    if (enableProgressionChanges) {
      try {
        ProgressionChanges(container);
      } catch (error) {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const hasForceCachedChanged = !!error?.message?.includes("forceCached");
        if (hasForceCachedChanged) {
          Logger.error(
            `Algorithmic Level Progression failed to make progression changes.
            Trying again using "forceCached" enabled.
            Try changing your mod loader so ALP is earlier than mods that add custom items to avoid this message in the future.
            Error: ` + error?.message
          );
          ProgressionChanges(container);
        } else {
          Logger.error(
            `Algorithmic Level Progression failed to make progression changes.
            Try changing your mod loader so ALP is earlier than mods that add custom items 
            Error: ` + error?.message
          );
        }
      }
      SetupLocationGlobals(container);
    }
    enableNonPMCBotChanges && SetupNonPMCBotChanges(container);
  }

  postSptLoad(container: DependencyContainer): void {
    try {
      leveledClothing && ClothingChanges(container);
    } catch (error) {
      const Logger = container.resolve<ILogger>("WinstonLogger");
      Logger.error(
        `Algorithmic Level Progression failed to makeclothing changes.
        Try turning off custom clothing in the config!
        Error: ` + error?.message
      );
    }
  }
}

module.exports = { mod: new AlgorithmicLevelProgression() };
