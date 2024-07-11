import { inject, injectable } from "tsyringe";


import { ProfileController } from "@spt/controllers/ProfileController";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { IGetBodyResponseData } from "@spt/models/eft/httpResponse/IGetBodyResponseData";
import { IGetProfileSettingsRequest } from "@spt/models/eft/profile/IGetProfileSettingsRequest";
import { HttpResponseUtil } from "@spt/utils/HttpResponseUtil";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { ProfileCallbacks } from "@spt/callbacks/ProfileCallbacks";

/** Handle profile related client events */
@injectable()
export class MyCustomProfileCallbacks extends ProfileCallbacks
{
    constructor(
        @inject("HttpResponseUtil") protected httpResponse: HttpResponseUtil,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("ProfileController") protected profileController: ProfileController,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
    )
    {
        // Pass the parent class (LauncherCallbacks) the dependencies it needs to work
        super(httpResponse, timeUtil, profileController, profileHelper);
    }

    public override getProfileSettings(
        url: string,
        info: IGetProfileSettingsRequest,
        sessionId: string,
    ): IGetBodyResponseData<boolean>
    {
        
        return this.httpResponse.getBody(this.profileController.setChosenProfileIcon(sessionId, info));
    }
}
