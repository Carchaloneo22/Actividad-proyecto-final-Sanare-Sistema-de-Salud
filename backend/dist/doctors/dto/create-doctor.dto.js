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
exports.CreateDoctorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDoctorDto {
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del doctor',
        example: 'Dr. Juan Pérez',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del doctor',
        example: 'juan.perez@hospital.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El email es requerido' }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del doctor',
        example: '+54 11 1234-5678',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El teléfono es requerido' }),
    (0, class_validator_1.Matches)(/^[\d\s\+\-\(\)]+$/, { message: 'Formato de teléfono inválido' }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hospital o centro de salud',
        example: 'Hospital Central',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El hospital es requerido' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre del hospital debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre del hospital no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "hospital", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la especialidad',
        example: 'uuid-de-especialidad',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID de especialidad inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La especialidad es requerida' }),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "specialtyId", void 0);
//# sourceMappingURL=create-doctor.dto.js.map