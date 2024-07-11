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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomProfileCallbacks = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ProfileController_1 = require("/snapshot/project/obj/controllers/ProfileController");
const ProfileHelper_1 = require("/snapshot/project/obj/helpers/ProfileHelper");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const TimeUtil_1 = require("/snapshot/project/obj/utils/TimeUtil");
const ProfileCallbacks_1 = require("/snapshot/project/obj/callbacks/ProfileCallbacks");
/** Handle profile related client events */
let MyCustomProfileCallbacks = class MyCustomProfileCallbacks extends ProfileCallbacks_1.ProfileCallbacks {
    httpResponse;
    timeUtil;
    profileController;
    profileHelper;
    constructor(httpResponse, timeUtil, profileController, profileHelper) {
        // Pass the parent class (LauncherCallbacks) the dependencies it needs to work
        super(httpResponse, timeUtil, profileController, profileHelper);
        this.httpResponse = httpResponse;
        this.timeUtil = timeUtil;
        this.profileController = profileController;
        this.profileHelper = profileHelper;
    }
    getProfileSettings(url, info, sessionId) {
        return this.httpResponse.getBody(this.profileController.setChosenProfileIcon(sessionId, info));
    }
};
exports.MyCustomProfileCallbacks = MyCustomProfileCallbacks;
exports.MyCustomProfileCallbacks = MyCustomProfileCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("TimeUtil")),
    __param(2, (0, tsyringe_1.inject)("ProfileController")),
    __param(3, (0, tsyringe_1.inject)("ProfileHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _b : Object, typeof (_c = typeof ProfileController_1.ProfileController !== "undefined" && ProfileController_1.ProfileController) === "function" ? _c : Object, typeof (_d = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _d : Object])
], MyCustomProfileCallbacks);
//# sourceMappingURL=MyCustomProfileCallbacks.js.map