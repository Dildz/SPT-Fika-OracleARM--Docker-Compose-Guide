
import { DependencyContainer } from "tsyringe";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class BrightLasers implements IPostSptLoadMod
{
    private mod: string

    constructor() 
    {
        this.mod = "acidphantasm-brightlasers"; // Set name of mod so we can log it to console later
    }

    public postSptLoad(container: DependencyContainer): void 
    {
		// get the logger from the server container
        const logger = container.resolve<ILogger>("WinstonLogger");
		
        logger.log(`[${this.mod}] Bundle loaded.`, "green");
	}
}

module.exports = { mod: new BrightLasers() }