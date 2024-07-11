import { inject, injectable } from "tsyringe";


import { ProfileController } from "@spt/controllers/ProfileController";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { IGetProfileSettingsRequest } from "@spt/models/eft/profile/IGetProfileSettingsRequest";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { HashUtil } from "@spt/utils/HashUtil";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { PlayerScavGenerator } from "@spt/generators/PlayerScavGenerator";
import { DialogueHelper } from "@spt/helpers/DialogueHelper";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { QuestHelper } from "@spt/helpers/QuestHelper";
import { TraderHelper } from "@spt/helpers/TraderHelper";
import { EventOutputHolder } from "@spt/routers/EventOutputHolder";
import { SaveServer } from "@spt/servers/SaveServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { LocalisationService } from "@spt/services/LocalisationService";
import { MailSendService } from "@spt/services/MailSendService";
import { ProfileFixerService } from "@spt/services/ProfileFixerService";
import { SeasonalEventService } from "@spt/services/SeasonalEventService";

/** Handle profile related client events */
@injectable()
export class MyCustomProfileController extends ProfileController
{
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("PrimaryCloner") protected cloner: ICloner,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("SaveServer") protected saveServer: SaveServer,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("ProfileFixerService") protected profileFixerService: ProfileFixerService,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("SeasonalEventService") protected seasonalEventService: SeasonalEventService,
        @inject("MailSendService") protected mailSendService: MailSendService,
        @inject("PlayerScavGenerator") protected playerScavGenerator: PlayerScavGenerator,
        @inject("EventOutputHolder") protected eventOutputHolder: EventOutputHolder,
        @inject("TraderHelper") protected traderHelper: TraderHelper,
        @inject("DialogueHelper") protected dialogueHelper: DialogueHelper,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
    )
    {
        // Pass the parent class (ProfileController) the dependencies it needs to work
        super(logger, 
            hashUtil, 
            cloner, 
            timeUtil, 
            saveServer, 
            databaseService, 
            itemHelper, 
            profileFixerService, 
            localisationService, 
            seasonalEventService,
            mailSendService,
            playerScavGenerator,
            eventOutputHolder,
            traderHelper,
            dialogueHelper,
            questHelper,
            profileHelper
        );
    }

    public override setChosenProfileIcon(sessionId: string, request: IGetProfileSettingsRequest): boolean
    {
        const profileToUpdate = this.profileHelper.getPmcProfile(sessionId);
        if (!profileToUpdate)
        {
            return false;
        }

        if (request.memberCategory !== null)
        {
            profileToUpdate.Info.SelectedMemberCategory = request.memberCategory;
        }
        
        if (request.squadInviteRestriction !== null)
        {
            profileToUpdate.Info.SquadInviteRestriction = request.squadInviteRestriction;
        }
        return true;
    }
}