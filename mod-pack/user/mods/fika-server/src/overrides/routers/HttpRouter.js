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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRouterOverride = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const HttpServerHelper_1 = require("/snapshot/project/obj/helpers/HttpServerHelper");
const Override_1 = require("../../di/Override");
// Thanks to DrakiaXYZ for this implementation
let HttpRouterOverride = class HttpRouterOverride extends Override_1.Override {
    httpServerHelper;
    constructor(httpServerHelper) {
        super();
        this.httpServerHelper = httpServerHelper;
    }
    execute(container) {
        // We need access to the full `req` object, so we need to hijack the getResponse method
        container.afterResolution("HttpRouter", (_, result) => {
            const originalGetResponse = result.getResponse;
            result.getResponse = async (req, info, sessionID) => {
                let response = await originalGetResponse.apply(result, [req, info, sessionID]);
                // if the response contains host, replace host with ours
                if (req.headers?.host) {
                    response = response.replaceAll(this.httpServerHelper.buildUrl(), req.headers.host);
                }
                return response;
            };
        }, { frequency: "Always" });
    }
};
exports.HttpRouterOverride = HttpRouterOverride;
exports.HttpRouterOverride = HttpRouterOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpServerHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpServerHelper_1.HttpServerHelper !== "undefined" && HttpServerHelper_1.HttpServerHelper) === "function" ? _a : Object])
], HttpRouterOverride);
//# sourceMappingURL=HttpRouter.js.map