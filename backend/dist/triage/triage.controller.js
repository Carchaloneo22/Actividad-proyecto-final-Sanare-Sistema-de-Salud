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
exports.TriageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const triage_service_1 = require("./triage.service");
const triage_dto_1 = require("./dto/triage.dto");
let TriageController = class TriageController {
    constructor(triageService) {
        this.triageService = triageService;
    }
    async analyzeSymptoms(dto) {
        return this.triageService.analyze(dto.symptoms);
    }
};
exports.TriageController = TriageController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Analizar síntomas y orientar especialidad médica con IA' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Orientación médica generada con éxito',
        type: triage_dto_1.TriageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Descripción de síntomas inválida' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Límite de solicitudes de triaje superado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [triage_dto_1.AnalyzeSymptomsDto]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "analyzeSymptoms", null);
exports.TriageController = TriageController = __decorate([
    (0, swagger_1.ApiTags)('triage'),
    (0, common_1.Controller)('triage'),
    __metadata("design:paramtypes", [triage_service_1.TriageService])
], TriageController);
//# sourceMappingURL=triage.controller.js.map