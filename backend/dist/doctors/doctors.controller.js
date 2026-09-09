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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const doctors_service_1 = require("./doctors.service");
const create_doctor_dto_1 = require("./dto/create-doctor.dto");
const update_doctor_dto_1 = require("./dto/update-doctor.dto");
const doctor_entity_1 = require("./entities/doctor.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DoctorsController = class DoctorsController {
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    findAll(specialtyId) {
        return this.doctorsService.findAll(specialtyId);
    }
    findOne(id) {
        return this.doctorsService.findOne(id);
    }
    create(createDto) {
        return this.doctorsService.create(createDto);
    }
    update(id, updateDto) {
        return this.doctorsService.update(id, updateDto);
    }
    async getAvailableSlots(id, dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Fecha inválida');
        }
        return this.doctorsService.getAvailableSlots(id, date);
    }
    remove(id) {
        return this.doctorsService.remove(id);
    }
    createSlot(id, slotDto) {
        return this.doctorsService.createAvailableSlot(id, new Date(slotDto.startTime), new Date(slotDto.endTime));
    }
    generateSlots(id, generateDto) {
        return this.doctorsService.generateWeekSlots(id, generateDto.daysOfWeek, generateDto.startHour, generateDto.endHour, generateDto.weeksAhead);
    }
    clearSlots(id) {
        return this.doctorsService.clearAllSlots(id);
    }
    removeDuplicates(id) {
        return this.doctorsService.removeDuplicateSlots(id);
    }
    removeAllDuplicates() {
        return this.doctorsService.removeDuplicateSlotsForAll();
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los médicos' }),
    (0, swagger_1.ApiQuery)({ name: 'specialtyId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de médicos', type: [doctor_entity_1.DoctorEntity] }),
    __param(0, (0, common_1.Query)('specialtyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un médico por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Médico encontrado', type: doctor_entity_1.DoctorEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Médico no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo médico (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Médico creado', type: doctor_entity_1.DoctorEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_doctor_dto_1.CreateDoctorDto]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un médico (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Médico actualizado', type: doctor_entity_1.DoctorEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Médico no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_doctor_dto_1.UpdateDoctorDto]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/available-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener slots disponibles para un médico' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Fecha en formato ISO (ej: 2023-01-01)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de slots disponibles' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un médico (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Médico eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No se puede eliminar el médico' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Médico no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/slots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear horario disponible para un médico (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Horario creado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "createSlot", null);
__decorate([
    (0, common_1.Post)(':id/slots/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generar horarios automáticamente (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Horarios generados' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "generateSlots", null);
__decorate([
    (0, common_1.Delete)(':id/slots'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar slots no reservados (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slots eliminados' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "clearSlots", null);
__decorate([
    (0, common_1.Delete)(':id/slots/duplicates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar slots duplicados para un doctor (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Duplicados eliminados' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "removeDuplicates", null);
__decorate([
    (0, common_1.Delete)('all/duplicates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar slots duplicados para TODOS los doctores (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Duplicados eliminados en todos los doctores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "removeAllDuplicates", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, swagger_1.ApiTags)('doctors'),
    (0, common_1.Controller)('doctors'),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map