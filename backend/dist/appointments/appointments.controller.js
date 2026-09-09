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
exports.AppointmentsPublicController = exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointments_service_1 = require("./appointments.service");
const client_1 = require("@prisma/client");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const appointment_entity_1 = require("./entities/appointment.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const client_2 = require("@prisma/client");
const user_entity_1 = require("../auth/entities/user.entity");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    findAll(status, user) {
        return this.appointmentsService.findAll(status);
    }
    getStats() {
        return this.appointmentsService.getStats();
    }
    findOne(id) {
        return this.appointmentsService.findOne(id);
    }
    create(createDto, user) {
        return this.appointmentsService.create({
            ...createDto,
            date: new Date(createDto.date),
            userId: user.id,
        });
    }
    cancel(id, user) {
        return this.appointmentsService.cancel(id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los turnos' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.AppointmentStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de turnos', type: [appointment_entity_1.AppointmentEntity] }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_2.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de turnos (solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un turno por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Turno encontrado', type: appointment_entity_1.AppointmentEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Turno no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_2.UserRole.PATIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo turno (solo Pacientes)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Turno creado', type: appointment_entity_1.AppointmentEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Horario no disponible' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar un turno' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Turno cancelado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Turno no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.UserEntity]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "cancel", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('appointments'),
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
let AppointmentsPublicController = class AppointmentsPublicController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    getByToken(token) {
        return this.appointmentsService.getByToken(token);
    }
    cancelByToken(token) {
        return this.appointmentsService.cancelByToken(token);
    }
};
exports.AppointmentsPublicController = AppointmentsPublicController;
__decorate([
    (0, common_1.Get)('token/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalles de turno por token (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Turno encontrado', type: appointment_entity_1.AppointmentEntity }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsPublicController.prototype, "getByToken", null);
__decorate([
    (0, common_1.Post)('cancel/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar turno por token (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Turno cancelado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o turno ya cancelado' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsPublicController.prototype, "cancelByToken", null);
exports.AppointmentsPublicController = AppointmentsPublicController = __decorate([
    (0, swagger_1.ApiTags)('appointments-public'),
    (0, common_1.Controller)('appointments-public'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsPublicController);
//# sourceMappingURL=appointments.controller.js.map