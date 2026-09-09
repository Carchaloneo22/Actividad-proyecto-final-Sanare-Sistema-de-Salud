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
exports.SpecialtiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let SpecialtiesService = class SpecialtiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.specialty.findMany({
            include: {
                _count: {
                    select: { doctors: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.specialty.findUnique({
            where: { id },
            include: {
                doctors: {
                    include: {
                        availableSlots: {
                            where: {
                                isBooked: false,
                                startTime: { gte: new Date() },
                            },
                        },
                    },
                },
            },
        });
    }
    async create(data) {
        return this.prisma.specialty.create({ data });
    }
};
exports.SpecialtiesService = SpecialtiesService;
exports.SpecialtiesService = SpecialtiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialtiesService);
//# sourceMappingURL=specialties.service.js.map