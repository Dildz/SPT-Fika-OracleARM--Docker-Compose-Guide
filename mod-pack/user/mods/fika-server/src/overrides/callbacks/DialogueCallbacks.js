"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueCallbacksOverride = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const FikaDialogueController_1 = require("../../controllers/FikaDialogueController");
const Override_1 = require("../../di/Override");
let DialogueCallbacksOverride = class DialogueCallbacksOverride extends Override_1.Override {
    httpResponseUtil;
    fikaDialogueController;
    constructor(httpResponseUtil, fikaDialogueController) {
        super();
        this.httpResponseUtil = httpResponseUtil;
        this.fikaDialogueController = fikaDialogueController;
    }
    execute(container) {
        container.afterResolution("DialogueCallbacks", (_t, result) => {
            result.listOutbox = (_url, _info, sessionID) => {
                return this.httpResponseUtil.getBody(this.fikaDialogueController.listOutbox(sessionID));
            };
            result.listInbox = (_url, _info, sessionID) => {
                return this.httpResponseUtil.getBody(this.fikaDialogueController.listInbox(sessionID));
            };
            result.sendFriendRequest = (_url, info, sessionID) => {
                return this.httpResponseUtil.getBody(this.fikaDialogueController.sendFriendRequest(sessionID, info.to));
            };
            result.acceptAllFriendRequests = (_url, _info, sessionID) => {
                this.fikaDialogueController.acceptAllFriendRequests(sessionID);
                return this.httpResponseUtil.nullResponse();
            };
            result.acceptFriendRequest = (_url, info, sessionID) => {
                this.fikaDialogueController.acceptFriendRequest(info.profileId, sessionID);
                return this.httpResponseUtil.getBody(true);
            };
            result.declineFriendRequest = (_url, info, sessionID) => {
                this.fikaDialogueController.declineFriendRequest(info.profileId, sessionID);
                return this.httpResponseUtil.getBody(true);
            };
            result.cancelFriendRequest = (_url, info, sessionID) => {
                this.fikaDialogueController.cancelFriendRequest(sessionID, info.profileId);
                return this.httpResponseUtil.getBody(true);
            };
            result.deleteFriend = (_url, info, sessionID) => {
                this.fikaDialogueController.deleteFriend(sessionID, info.friend_id);
                return this.httpResponseUtil.nullResponse();
            };
            result.ignoreFriend = (_url, info, sessionID) => {
                this.fikaDialogueController.ignoreFriend(sessionID, info.uid);
                return this.httpResponseUtil.nullResponse();
            };
            result.unIgnoreFriend = (_url, info, sessionID) => {
                this.fikaDialogueController.unIgnoreFriend(sessionID, info.uid);
                return this.httpResponseUtil.nullResponse();
            };
        }, { frequency: "Always" });
    }
};
exports.DialogueCallbacksOverride = DialogueCallbacksOverride;
exports.DialogueCallbacksOverride = DialogueCallbacksOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaDialogueController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaDialogueController_1.FikaDialogueController !== "undefined" && FikaDialogueController_1.FikaDialogueController) === "function" ? _b : Object])
], DialogueCallbacksOverride);
//# sourceMappingURL=DialogueCallbacks.js.map