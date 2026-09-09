"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginGuard = void 0;
const common_1 = require("@nestjs/common");
const cors_config_1 = require("../config/cors.config");
let OriginGuard = class OriginGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const origin = this.extractOrigin(request);
        if (!origin) {
            return true;
        }
        if (!(0, cors_config_1.getAllowedOrigins)().includes(origin)) {
            throw new common_1.ForbiddenException('Origen de la solicitud no permitido');
        }
        return true;
    }
    extractOrigin(request) {
        const originHeader = request.headers.origin;
        if (originHeader) {
            return originHeader;
        }
        const referer = request.headers.referer;
        if (referer) {
            try {
                return new URL(referer).origin;
            }
            catch {
                return null;
            }
        }
        return null;
    }
};
exports.OriginGuard = OriginGuard;
exports.OriginGuard = OriginGuard = __decorate([
    (0, common_1.Injectable)()
], OriginGuard);
//# sourceMappingURL=origin.guard.js.map