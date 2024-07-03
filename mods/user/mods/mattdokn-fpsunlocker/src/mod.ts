import { DependencyContainer } from "tsyringe";

import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class FpsUnlocker implements IPostDBLoadMod
{
    private modConfig = require("../config/config.json");

    postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        databaseServer.getTables().settings.config.FramerateLimit.MaxFramerateLobbyLimit = Number(this.modConfig["framerate"]);
        databaseServer.getTables().settings.config.FramerateLimit.MaxFramerateGameLimit = Number(this.modConfig["framerate"]);
        logger.info("[FpsUnlocker] Applied framerate settings.");
    }
}

module.exports = { mod: new FpsUnlocker() };
