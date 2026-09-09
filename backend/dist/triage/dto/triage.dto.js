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
exports.TriageResponseDto = exports.AnalyzeSymptomsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AnalyzeSymptomsDto {
}
exports.AnalyzeSymptomsDto = AnalyzeSymptomsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de los síntomas del paciente para orientación médica',
        example: 'Tengo dolor de cabeza punzante en la frente, náuseas leves y molestia ante la luz solar desde ayer',
        minLength: 5,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsString)({ message: 'Los síntomas deben ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Debe ingresar una descripción de sus síntomas' }),
    (0, class_validator_1.MinLength)(5, { message: 'Por favor describa sus síntomas con mayor detalle (mínimo 5 caracteres)' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'La descripción no puede superar los 1000 caracteres' }),
    __metadata("design:type", String)
], AnalyzeSymptomsDto.prototype, "symptoms", void 0);
class TriageResponseDto {
}
exports.TriageResponseDto = TriageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Especialidad médica sugerida' }),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "recommendedSpecialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nivel estimado de urgencia', enum: ['Baja', 'Media', 'Alta'] }),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Explicación médica concisa de la recomendación' }),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "reasoning", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aviso legal y deslinde de responsabilidad médica' }),
    __metadata("design:type", String)
], TriageResponseDto.prototype, "disclaimer", void 0);
//# sourceMappingURL=triage.dto.js.map