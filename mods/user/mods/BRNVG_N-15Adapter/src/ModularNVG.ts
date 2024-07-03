
import { DependencyContainer } from "tsyringe";
import {IPostDBLoadMod} from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";


class ModularNVG implements IPostDBLoadMod
{ 
    postDBLoad(container: DependencyContainer)
	{
        const Logger = container.resolve("WinstonLogger");
        const DB = container.resolve("DatabaseServer").getTables();
        const database = DB.templates.items;
        
        for (let file in database) {
            let fileData = database[file];
			//N-15 Adapter PNV-10T dovetail adapter
			if (fileData._id === "5c0695860db834001b735461") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("5c066e3a0db834001b7353f0");
				Logger.info("[SBNV]: Your N-15s can also be mounted on helmets now!");
            }
        }
    }
}
module.exports = {mod: new ModularNVG};