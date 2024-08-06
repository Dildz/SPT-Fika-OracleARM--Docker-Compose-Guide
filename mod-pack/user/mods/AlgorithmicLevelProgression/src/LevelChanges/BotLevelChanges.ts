import { IBotBase } from "../../types/models/eft/common/tables/IBotBase";
import { BotGenerationDetails } from "../../types/models/spt/bots/BotGenerationDetails";
import { IRandomisedBotLevelResult } from "../../types/models/eft/bot/IRandomisedBotLevelResult";
import { MinMax } from "../../types/models/common/MinMax";
import { DependencyContainer } from "tsyringe";
import { botRangeAtLevel, levelRange } from "../../config/config.json";
import { getCurrentLevelRange } from "../LoadoutChanges/utils";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { BotLevelGenerator } from "@spt/generators/BotLevelGenerator";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import config from "../../config/config.json";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";

export default function BotLevelChanges(
  container: DependencyContainer
): undefined {
  const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
  const botLevelGenerator =
    container.resolve<BotLevelGenerator>("BotLevelGenerator");
  const configServer = container.resolve<ConfigServer>("ConfigServer");
  const pmcConfig = configServer.getConfig<IPmcConfig>(ConfigTypes.PMC);

  pmcConfig.botRelativeLevelDeltaMax = 1;

  container.afterResolution(
    "BotLevelGenerator",
    (_t, result: BotLevelGenerator) => {
      result.generateBotLevel = (
        levelDetails: MinMax,
        botGenerationDetails: BotGenerationDetails,
        bot: IBotBase
      ): IRandomisedBotLevelResult => {
        if (!botGenerationDetails.isPmc)
          return botLevelGenerator.generateBotLevel(
            levelDetails,
            botGenerationDetails,
            bot
          );

        const { playerLevel } = botGenerationDetails;

        const currentLevelRange = getCurrentLevelRange(playerLevel);
        const currentRangeArray = botRangeAtLevel[currentLevelRange];
        const test = currentRangeArray.map((val, k) => ({
          levelRange: k + 1,
          val: Math.random() * val,
        }));

        const randomizedRange = test.sort((a, b) => b.val - a.val)[0]
          .levelRange;
        const range = { ...levelRange[randomizedRange] } as MinMax;
        if (range.max > 99) {
          range.max = Math.min(
            range.max,
            Math.max(range.min + 10, playerLevel + 10, range.max - range.min)
          );
        }

        const level =
          Math.round((range.max - range.min) * Math.random()) + range.min;

        const final = {
          level,
          exp: profileHelper.getExperience(level),
        };

        // debug && console.log(final)

        return final;
      };
    },
    { frequency: "Always" }
  );

  config.debug &&
    console.log("Algorthimic Progression: BotLevelGenerator registered");
}
