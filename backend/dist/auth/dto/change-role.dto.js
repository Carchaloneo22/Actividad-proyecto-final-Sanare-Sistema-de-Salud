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
exports.ChangeRoleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class ChangeRoleDto {
}
exports.ChangeRoleDto = ChangeRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador único del usuario (UUID)',
        example: 'd9b29e3a-718c-4f76-a05e-7a9123849102',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'El userId debe ser un UUID v4 válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo userId es obligatorio' }),
    __metadata("design:type", String)
], ChangeRoleDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.UserRole,
        description: 'Nuevo rol a asignar al usuario (PATIENT, DOCTOR, ADMIN)',
        example: client_1.UserRole.DOCTOR,
    }),
    (0, class_validator_1.IsEnum)(client_1.UserRole, {
        message: 'El nuevo rol debe ser PATIENT, DOCTOR o ADMIN',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo newRole es obligatorio' }),
    __metadata("design:type", String)
], ChangeRoleDto.prototype, "newRole", void 0);
//# sourceMappingURL=change-role.dto.js.map