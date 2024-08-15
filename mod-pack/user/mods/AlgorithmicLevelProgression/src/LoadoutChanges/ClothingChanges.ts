import { DependencyContainer } from "tsyringe";
import { buildClothingWeighting, cloneDeep } from "./utils";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { globalValues } from "./GlobalValues";

export default function ClothingChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const tables = databaseServer.getTables();

  const configServer = container.resolve<ConfigServer>("ConfigServer");
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

  const usecAppearance = tables.bots.types.usec.appearance;
  const bearAppearance = tables.bots.types.bear.appearance;
  const traders = tables.traders;
  const customization = tables.templates.customization;

  let allTradersSuits = Object.values(traders)
    .filter(({ suits }) => !!suits?.length)
    .map(({ suits }) => suits)
    .flat(1);

  buildClothingWeighting(
    allTradersSuits,
    customization,
    botConfig,
    usecAppearance,
    bearAppearance
  );
  globalValues.originalBotTypes = cloneDeep(tables.bots.types);
  globalValues.originalWeighting = cloneDeep(botConfig.equipment.pmc);
}
