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
exports.FikaSendItemCallbacks = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const FikaSendItemController_1 = require("../controllers/FikaSendItemController");
let FikaSendItemCallbacks = class FikaSendItemCallbacks {
    httpResponseUtil;
    fikaSendItemController;
    constructor(httpResponseUtil, fikaSendItemController) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaSendItemController = fikaSendItemController;
        // empty
    }
    handleSendItem(pmcData, body, sessionID) {
        return this.fikaSendItemController.sendItem(pmcData, body, sessionID);
    }
    /** Handle /fika/senditem/availablereceivers */
    handleAvailableReceivers(_url, _info, sessionID) {
        return this.httpResponseUtil.noBody(this.fikaSendItemController.handleAvailableReceivers(sessionID));
    }
};
exports.FikaSendItemCallbacks = FikaSendItemCallbacks;
exports.FikaSendItemCallbacks = FikaSendItemCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaSendItemController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaSendItemController_1.FikaSendItemController !== "undefined" && FikaSendItemController_1.FikaSendItemController) === "function" ? _b : Object])
], FikaSendItemCallbacks);
//# sourceMappingURL=FikaSendItemCallbacks.js.map