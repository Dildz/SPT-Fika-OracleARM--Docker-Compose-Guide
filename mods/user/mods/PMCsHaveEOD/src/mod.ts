import { DependencyContainer } from "tsyringe";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

let logger: ILogger;
let configServer: ConfigServer;
let pmcConfig: IBotConfig;


class Mod {
  postDBLoad(container: DependencyContainer): void {
    logger = container.resolve<ILogger>("WinstonLogger");
    configServer = container.resolve<ConfigServer>("ConfigServer");
    pmcConfig = configServer.getConfig<IBotConfig>(ConfigTypes.PMC);

    const bots: IBotConfig = configServer.getConfig(
      ConfigTypes.PMC
    );

    bots.gameVersionWeight = {
      "edge_of_darkness": 100
    }

    bots.accountTypeWeight = {
      "2": 100
    }
  }
}


module.exports = { mod: new Mod() }
