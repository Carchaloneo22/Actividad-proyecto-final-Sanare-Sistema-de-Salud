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
exports.GenerateSlotsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GenerateSlotsDto {
}
exports.GenerateSlotsDto = GenerateSlotsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Días de la semana para generar slots (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)',
        example: [1, 2, 3, 4, 5],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)({ message: 'daysOfWeek debe ser un array de números' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Debe seleccionar al menos un día de la semana' }),
    (0, class_validator_1.ArrayMaxSize)(7, { message: 'No puede seleccionar más de 7 días' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Cada día debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { each: true, message: 'Los días deben estar entre 0 (Domingo) y 6 (Sábado)' }),
    (0, class_validator_1.Max)(6, { each: true, message: 'Los días deben estar entre 0 (Domingo) y 6 (Sábado)' }),
    __metadata("design:type", Array)
], GenerateSlotsDto.prototype, "daysOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hora de inicio de la jornada (0-23)',
        example: 9,
    }),
    (0, class_validator_1.IsInt)({ message: 'La hora de inicio debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'La hora de inicio debe estar entre 0 y 23' }),
    (0, class_validator_1.Max)(23, { message: 'La hora de inicio debe estar entre 0 y 23' }),
    __metadata("design:type", Number)
], GenerateSlotsDto.prototype, "startHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hora de fin de la jornada (1-24)',
        example: 17,
    }),
    (0, class_validator_1.IsInt)({ message: 'La hora de fin debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'La hora de fin debe estar entre 1 y 24' }),
    (0, class_validator_1.Max)(24, { message: 'La hora de fin debe estar entre 1 y 24' }),
    __metadata("design:type", Number)
], GenerateSlotsDto.prototype, "endHour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cantidad de semanas a generar (por defecto 4, máximo 12)',
        example: 4,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'weeksAhead debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'Debe generar al menos 1 semana' }),
    (0, class_validator_1.Max)(12, { message: 'No puede generar más de 12 semanas' }),
    __metadata("design:type", Number)
], GenerateSlotsDto.prototype, "weeksAhead", void 0);
//# sourceMappingURL=generate-slots.dto.js.map