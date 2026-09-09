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
exports.SpecialtiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const specialties_service_1 = require("./specialties.service");
let SpecialtiesController = class SpecialtiesController {
    constructor(specialtiesService) {
        this.specialtiesService = specialtiesService;
    }
    findAll() {
        return this.specialtiesService.findAll();
    }
    findOne(id) {
        return this.specialtiesService.findOne(id);
    }
    create(createDto) {
        return this.specialtiesService.create(createDto);
    }
};
exports.SpecialtiesController = SpecialtiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las especialidades' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de especialidades' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una especialidad por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Especialidad encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Especialidad no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva especialidad' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Especialidad creada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "create", null);
exports.SpecialtiesController = SpecialtiesController = __decorate([
    (0, swagger_1.ApiTags)('specialties'),
    (0, common_1.Controller)('specialties'),
    __metadata("design:paramtypes", [specialties_service_1.SpecialtiesService])
], SpecialtiesController);
//# sourceMappingURL=specialties.controller.js.map