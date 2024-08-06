import { DependencyContainer } from "tsyringe";
import { globalValues } from "./GlobalValues";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { cloneDeep } from "./utils";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";

export const SetupLocationGlobals = (
  container: DependencyContainer
): undefined => {
  const configServer = container.resolve<ConfigServer>("ConfigServer");
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
  const tables = databaseServer.getTables();
  globalValues.Logger = container.resolve("WinstonLogger");
  globalValues.tables = tables;
  globalValues.profileHelper = profileHelper;
  globalValues.originalBotTypes = cloneDeep(tables.bots.types);
  globalValues.configServer = configServer;
  globalValues.originalWeighting = cloneDeep(botConfig.equipment.pmc);
  // globalValues.setValuesForLocation('woods', 1)
};
