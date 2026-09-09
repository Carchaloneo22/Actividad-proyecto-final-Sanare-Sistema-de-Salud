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
exports.AppointmentEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class AppointmentEntity {
}
exports.AppointmentEntity = AppointmentEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único del turno' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del doctor' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario (paciente)' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del paciente' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "patientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email del paciente', required: false }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "patientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Teléfono del paciente' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "patientPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha y hora del turno' }),
    __metadata("design:type", Date)
], AppointmentEntity.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notas adicionales', required: false }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado del turno', enum: client_1.AppointmentStatus }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    __metadata("design:type", Date)
], AppointmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización' }),
    __metadata("design:type", Date)
], AppointmentEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=appointment.entity.js.map