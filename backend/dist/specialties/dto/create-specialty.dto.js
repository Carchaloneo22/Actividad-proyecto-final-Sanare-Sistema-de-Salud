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
exports.CreateSpecialtyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSpecialtyDto {
}
exports.CreateSpecialtyDto = CreateSpecialtyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la especialidad médica',
        example: 'Cardiología',
    }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la especialidad es obligatorio' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede superar los 100 caracteres' }),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción detallada de la especialidad',
        example: 'Especialistas en salud cardiovascular y prevención',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser un texto' }),
    (0, class_validator_1.MaxLength)(500, { message: 'La descripción no puede superar los 500 caracteres' }),
    __metadata("design:type", String)
], CreateSpecialtyDto.prototype, "description", void 0);
//# sourceMappingURL=create-specialty.dto.js.map