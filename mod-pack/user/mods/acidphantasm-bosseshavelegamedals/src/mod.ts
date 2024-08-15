import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseService } from "@spt/services/DatabaseService";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class BossesHaveLegaMedals implements IPostDBLoadMod
{
    private logger: ILogger

    public postDBLoad(container: DependencyContainer): void
    {
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const tables: IDatabaseTables = databaseService.getTables();

        const glukhar = tables.bots.types.bossgluhar.inventory.items.Pockets;
        const kaban = tables.bots.types.bossboar.inventory.items.Pockets;
        const killa = tables.bots.types.bosskilla.inventory.items.Pockets;
        const kollontay = tables.bots.types.bosskolontay.inventory.items.Pockets;
        const reshala = tables.bots.types.bossbully.inventory.items.Pockets;
        const sanitar = tables.bots.types.bosssanitar.inventory.items.Pockets;
        const shturman = tables.bots.types.bosskojaniy.inventory.items.Pockets;
        const tagilla = tables.bots.types.bosstagilla.inventory.items.Pockets;

        glukhar["6656560053eaaa7a23349c86"] = 2800;
        kaban["6656560053eaaa7a23349c86"] = 6750;
        killa["6656560053eaaa7a23349c86"] = 7000;
        kollontay["6656560053eaaa7a23349c86"] = 5950;
        reshala["6656560053eaaa7a23349c86"] = 4420;
        sanitar["6656560053eaaa7a23349c86"] = 4550;
        shturman["6656560053eaaa7a23349c86"] = 4300;
        tagilla["6656560053eaaa7a23349c86"] = 500;

        /*
        THIS IS ALL STUPID BUT I AM TIRED WHICH MAKES ME STUPID
        If you want to have something to get probability with weights, please do it better than me. LOL.

        const glukharTotal = Object.values(glukhar).reduce((a, b) => a + b, 0)
        const kabanTotal = Object.values(kaban).reduce((a, b) => a + b, 0)
        const killaTotal = Object.values(killa).reduce((a, b) => a + b, 0)
        const kollontayTotal = Object.values(kollontay).reduce((a, b) => a + b, 0)
        const reshalaTotal = Object.values(reshala).reduce((a, b) => a + b, 0)
        const sanitarTotal = Object.values(sanitar).reduce((a, b) => a + b, 0)
        const shturmanTotal = Object.values(shturman).reduce((a, b) => a + b, 0)
        const tagillaTotal = Object.values(tagilla).reduce((a, b) => a + b, 0)

        let value;
        let count;

        value = 2800;
        count = Object.keys(glukhar).length;
        this.logger.log(`glukhar: ${glukharTotal} --- if value: ${value} then chance is ${value / (glukharTotal+value)} -- total items: ${count}`, "yellow");

        value = 6750;
        count = Object.keys(kaban).length;
        this.logger.log(`kaban: ${kabanTotal} --- if value: ${value} then chance is ${value / (kabanTotal+value)} -- total items: ${count}`, "yellow");

        value = 7000;
        count = Object.keys(killa).length;
        this.logger.log(`killa: ${killaTotal} --- if value: ${value} then chance is ${value / (killaTotal+value)} -- total items: ${count}`, "yellow");

        value = 5950;
        count = Object.keys(kollontay).length;
        this.logger.log(`kollontay: ${kollontayTotal} --- if value: ${value} then chance is ${value / (kollontayTotal+value)} -- total items: ${count}`, "yellow");

        value = 4420;
        count = Object.keys(reshala).length;
        this.logger.log(`reshala: ${reshalaTotal} --- if value: ${value} then chance is ${value / (reshalaTotal+value)} -- total items: ${count}`, "yellow");

        value = 4550;
        count = Object.keys(sanitar).length;
        this.logger.log(`sanitar: ${sanitarTotal} --- if value: ${value} then chance is ${value / (sanitarTotal+value)} -- total items: ${count}`, "yellow");

        value = 4300;
        count = Object.keys(shturman).length;
        this.logger.log(`shturman: ${shturmanTotal} --- if value: ${value} then chance is ${value / (shturmanTotal+value)} -- total items: ${count}`, "yellow");

        value = 500;
        count = Object.keys(tagilla).length;
        this.logger.log(`tagilla: ${tagillaTotal} --- if value: ${value} then chance is ${value / (tagillaTotal+value)} -- total items: ${count}`, "yellow");
        
        */
    }
}

export const mod = new BossesHaveLegaMedals();
