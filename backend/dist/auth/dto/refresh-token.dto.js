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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Refresh token (opcional). Si no se envía, se lee de la cookie HTTP-Only valens_refresh_token.',
        example: 'abc123...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El token de refresco debe ser una cadena de texto' }),
    (0, class_validator_1.MaxLength)(256, { message: 'Token de refresco inválido' }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=refresh-token.dto.js.map