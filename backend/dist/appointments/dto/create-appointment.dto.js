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
exports.CreateAppointmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del doctor',
        example: 'uuid-del-doctor',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El doctor es requerido' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del paciente',
        example: 'Juan Pérez',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del paciente es requerido' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email del paciente',
        example: 'juan.perez@email.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del paciente',
        example: '+54 11 1234-5678',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El teléfono es requerido' }),
    (0, class_validator_1.Matches)(/^[\d\s\+\-\(\)]+$/, { message: 'Formato de teléfono inválido' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora del turno (ISO 8601)',
        example: '2024-01-15T10:00:00.000Z',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Formato de fecha inválido' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notas adicionales',
        example: 'Primera consulta por dolor de cabeza',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-appointment.dto.js.map