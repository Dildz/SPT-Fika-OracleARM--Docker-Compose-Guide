import { inject, injectable } from "tsyringe";

import { ItemHelper } from "@spt/helpers/ItemHelper";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { LocalisationService } from "@spt/services/LocalisationService";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { DialogueHelper } from "@spt/helpers/DialogueHelper";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { QuestConditionHelper } from "@spt/helpers/QuestConditionHelper";
import { QuestHelper } from "@spt/helpers/QuestHelper";
import { TraderHelper } from "@spt/helpers/TraderHelper";
import { IPmcData } from "@spt/models/eft/common/IPmcData";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { EventOutputHolder } from "@spt/routers/EventOutputHolder";
import { LocaleService } from "@spt/services/LocaleService";
import { MailSendService } from "@spt/services/MailSendService";
import { PlayerService } from "@spt/services/PlayerService";
import { HttpResponseUtil } from "@spt/utils/HttpResponseUtil";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { QuestController } from "@spt/controllers/QuestController";
import { SeasonalEventService } from "@spt/services/SeasonalEventService";

/** Handle profile related client events */
@injectable()
export class MyCustomQuestController extends QuestController
{
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("EventOutputHolder") protected eventOutputHolder: EventOutputHolder,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("DialogueHelper") protected dialogueHelper: DialogueHelper,
        @inject("MailSendService") protected mailSendService: MailSendService,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("TraderHelper") protected traderHelper: TraderHelper,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("QuestConditionHelper") protected questConditionHelper: QuestConditionHelper,
        @inject("PlayerService") protected playerService: PlayerService,
        @inject("LocaleService") protected localeService: LocaleService,
        @inject("SeasonalEventService") protected seasonalEventService: SeasonalEventService,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("PrimaryCloner") protected cloner: ICloner,
    )
    {
        // Pass the parent class (QuestController) the dependencies it needs to work
        super(logger, 
            timeUtil, 
            httpResponseUtil, 
            eventOutputHolder, 
            databaseService, 
            itemHelper, 
            dialogueHelper, 
            mailSendService, 
            profileHelper, 
            traderHelper, 
            questHelper, 
            questConditionHelper, 
            playerService,
            localeService,
            seasonalEventService,
            localisationService,
            configServer,
            cloner,
        );
    }

    public override getClientQuests(sessionID: string): IQuest[]
    {
        const questsToShowPlayer: IQuest[] = [];
        const allQuests = this.questHelper.getQuestsFromDb();
        const profile: IPmcData = this.profileHelper.getPmcProfile(sessionID);

        for (const quest of allQuests)
        {
            // Player already accepted the quest, show it regardless of status
            const questInProfile = profile.Quests.find((x) => x.qid === quest._id);
            if (questInProfile)
            {
                quest.sptStatus = questInProfile.status;
                questsToShowPlayer.push(quest);
                continue;
            }

            // Filter out bear quests for usec and vice versa
            if (this.questHelper.questIsForOtherSide(profile.Info.Side, quest._id))
            {
                continue;
            }

            if (!this.questHelper.showEventQuestToPlayer(quest._id))
            {
                continue;
            }

            // Don't add quests that have a level higher than the user's
            if (!this.playerLevelFulfillsQuestRequirement(quest, profile.Info.Level))
            {
                continue;
            }

            // Player can use trader mods then remove them, leaving quests behind
            const trader = profile.TradersInfo[quest.traderId];
            if (!trader)
            {
                this.logger.debug(
                    `Unable to show quest: ${quest.QuestName} as its for a trader: ${quest.traderId} that no longer exists.`,
                );

                continue;
            }

            const questRequirements = this.questConditionHelper.getQuestConditions(quest.conditions.AvailableForStart);
            const loyaltyRequirements = this.questConditionHelper.getLoyaltyConditions(
                quest.conditions.AvailableForStart,
            );
            const standingRequirements = this.questConditionHelper.getStandingConditions(
                quest.conditions.AvailableForStart,
            );

            // Quest has no conditions, standing or loyalty conditions, add to visible quest list
            if (
                questRequirements.length === 0
                && loyaltyRequirements.length === 0
                && standingRequirements.length === 0
            )
            {
                quest.sptStatus = QuestStatus.AvailableForStart;
                questsToShowPlayer.push(quest);
                continue;
            }

            // Check the status of each quest condition, if any are not completed
            // then this quest should not be visible
            let haveCompletedPreviousQuest = true;
            for (const conditionToFulfil of questRequirements)
            {
                // If the previous quest isn't in the user profile, it hasn't been completed or started
                const prerequisiteQuest = profile.Quests.find((profileQuest) =>
                    conditionToFulfil.target.includes(profileQuest.qid),
                );
                if (!prerequisiteQuest)
                {
                    haveCompletedPreviousQuest = false;
                    break;
                }

                // Prereq does not have its status requirement fulfilled
                // Some bsg status ids are strings, MUST convert to number before doing includes check
                if (!conditionToFulfil.status.map((status) => Number(status)).includes(prerequisiteQuest.status))
                {
                    haveCompletedPreviousQuest = false;
                    break;
                }

                // Has a wait timer
                if (conditionToFulfil.availableAfter > 0)
                {
                    // Compare current time to unlock time for previous quest
                    const previousQuestCompleteTime = prerequisiteQuest.statusTimers[prerequisiteQuest.status];
                    const unlockTime = previousQuestCompleteTime + conditionToFulfil.availableAfter;
                    if (unlockTime > this.timeUtil.getTimestamp())
                    {
                        this.logger.debug(
                            `Quest ${quest.QuestName} is locked for another ${
                                unlockTime - this.timeUtil.getTimestamp()
                            } seconds`,
                        );
                    }
                }
            }

            // Previous quest not completed, skip
            if (!haveCompletedPreviousQuest)
            {
                continue;
            }

            let passesLoyaltyRequirements = true;
            for (const condition of loyaltyRequirements)
            {
                if (!this.questHelper.traderLoyaltyLevelRequirementCheck(condition, profile))
                {
                    passesLoyaltyRequirements = false;
                    break;
                }
            }

            let passesStandingRequirements = true;
            for (const condition of standingRequirements)
            {
                if (!this.questHelper.traderStandingRequirementCheck(condition, profile))
                {
                    passesStandingRequirements = false;
                    break;
                }
            }

            if (haveCompletedPreviousQuest && passesLoyaltyRequirements && passesStandingRequirements)
            {
                quest.sptStatus = QuestStatus.AvailableForStart;
                questsToShowPlayer.push(quest);
            }
        }

        return questsToShowPlayer;
    }
}
