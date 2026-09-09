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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let DoctorsService = class DoctorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(specialtyId) {
        return this.prisma.doctor.findMany({
            where: specialtyId ? { specialtyId } : undefined,
            include: {
                specialty: true,
                availableSlots: {
                    where: {
                        isBooked: false,
                        startTime: { gte: new Date() },
                    },
                    take: 10,
                    orderBy: { startTime: 'asc' },
                },
                _count: {
                    select: { appointments: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                specialty: true,
                availableSlots: {
                    where: {
                        isBooked: false,
                        startTime: { gte: new Date() },
                    },
                    orderBy: { startTime: 'asc' },
                },
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor con ID ${id} no encontrado`);
        }
        return doctor;
    }
    async create(createDto) {
        const specialty = await this.prisma.specialty.findUnique({
            where: { id: createDto.specialtyId },
        });
        if (!specialty) {
            throw new common_1.BadRequestException('Especialidad no encontrada');
        }
        const existingDoctor = await this.prisma.doctor.findUnique({
            where: { email: createDto.email },
        });
        if (existingDoctor) {
            throw new common_1.BadRequestException('El email ya está en uso');
        }
        return this.prisma.doctor.create({
            data: createDto,
            include: { specialty: true },
        });
    }
    async update(id, updateDto) {
        await this.findOne(id);
        if (updateDto.email) {
            const existingDoctor = await this.prisma.doctor.findUnique({
                where: { email: updateDto.email },
            });
            if (existingDoctor && existingDoctor.id !== id) {
                throw new common_1.BadRequestException('El email ya está en uso');
            }
        }
        if (updateDto.specialtyId) {
            const specialty = await this.prisma.specialty.findUnique({
                where: { id: updateDto.specialtyId },
            });
            if (!specialty) {
                throw new common_1.BadRequestException('Especialidad no encontrada');
            }
        }
        return this.prisma.doctor.update({
            where: { id },
            data: updateDto,
            include: { specialty: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        const pendingAppointments = await this.prisma.appointment.count({
            where: {
                doctorId: id,
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
        });
        if (pendingAppointments > 0) {
            throw new common_1.BadRequestException(`No se puede eliminar el doctor porque tiene ${pendingAppointments} turnos pendientes`);
        }
        await this.prisma.availableSlot.deleteMany({
            where: { doctorId: id },
        });
        return this.prisma.doctor.delete({
            where: { id },
        });
    }
    async createAvailableSlot(doctorId, startTime, endTime) {
        const slotDurationMs = 20 * 60 * 1000;
        const actualDuration = endTime.getTime() - startTime.getTime();
        if (Math.abs(actualDuration - slotDurationMs) > 60000) {
            throw new common_1.BadRequestException('La duración del turno debe ser exactamente de 20 minutos');
        }
        const now = new Date();
        if (startTime < now) {
            throw new common_1.BadRequestException('No se pueden crear turnos en el pasado');
        }
        const existingSlot = await this.prisma.availableSlot.findFirst({
            where: {
                doctorId,
                isBooked: false,
                OR: [
                    {
                        AND: [
                            { startTime: { gte: startTime } },
                            { startTime: { lt: endTime } },
                        ],
                    },
                    {
                        AND: [
                            { endTime: { gt: startTime } },
                            { endTime: { lte: endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gte: endTime } },
                        ],
                    },
                ],
            },
        });
        if (existingSlot) {
            throw new common_1.BadRequestException(`Ya existe un turno programado para ese horario (${existingSlot.startTime.toLocaleTimeString()} - ${existingSlot.endTime.toLocaleTimeString()})`);
        }
        return this.prisma.availableSlot.create({
            data: {
                doctorId,
                startTime,
                endTime,
            },
        });
    }
    async generateWeekSlots(doctorId, daysOfWeek, startHour, endHour, weeksAhead = 4) {
        if (startHour >= endHour) {
            throw new common_1.BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
        }
        if (endHour - startHour > 12) {
            throw new common_1.BadRequestException('El rango de horario no puede ser mayor a 12 horas');
        }
        const invalidDays = daysOfWeek.filter(d => d < 0 || d > 6);
        if (invalidDays.length > 0) {
            throw new common_1.BadRequestException(`Días de la semana inválidos: ${invalidDays.join(', ')}. Use valores de 0 (Domingo) a 6 (Sábado)`);
        }
        await this.findOne(doctorId);
        const slots = [];
        const now = new Date();
        const slotDurationMs = 20 * 60 * 1000;
        const sortedDays = [...new Set(daysOfWeek)].sort();
        for (let week = 0; week < weeksAhead; week++) {
            for (const dayOfWeek of sortedDays) {
                const date = new Date(now);
                const daysToAdd = (dayOfWeek - date.getDay() + 7) % 7 + (week * 7);
                date.setDate(date.getDate() + daysToAdd);
                date.setHours(0, 0, 0, 0);
                if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                    continue;
                }
                let currentSlotStart = new Date(date);
                currentSlotStart.setHours(startHour, 0, 0, 0);
                const endTime = new Date(date);
                endTime.setHours(endHour, 0, 0, 0);
                while (currentSlotStart < endTime) {
                    const slotEnd = new Date(currentSlotStart.getTime() + slotDurationMs);
                    if (slotEnd > endTime) {
                        break;
                    }
                    if (currentSlotStart >= now) {
                        try {
                            const slot = await this.createAvailableSlot(doctorId, new Date(currentSlotStart), new Date(slotEnd));
                            slots.push(slot);
                        }
                        catch (error) {
                            console.log(`No se pudo crear slot: ${error.message}`);
                        }
                    }
                    currentSlotStart = new Date(currentSlotStart.getTime() + slotDurationMs);
                }
            }
        }
        return {
            created: slots.length,
            message: `Se crearon ${slots.length} turnos de 20 minutos`,
            slots: slots.map(slot => ({
                id: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: slot.isBooked
            })),
        };
    }
    async getAvailableSlots(doctorId, date) {
        await this.findOne(doctorId);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const slots = await this.prisma.availableSlot.findMany({
            where: {
                doctorId,
                isBooked: false,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        const uniqueSlots = new Map();
        for (const slot of slots) {
            const timeKey = slot.startTime.toISOString();
            if (!uniqueSlots.has(timeKey)) {
                uniqueSlots.set(timeKey, slot);
            }
        }
        const deduplicatedSlots = Array.from(uniqueSlots.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        return deduplicatedSlots.map(slot => ({
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            durationMinutes: Math.round((slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60)),
        }));
    }
    async clearAllSlots(doctorId) {
        await this.findOne(doctorId);
        const result = await this.prisma.availableSlot.deleteMany({
            where: {
                doctorId,
                isBooked: false,
            },
        });
        return { deleted: result.count };
    }
    async removeDuplicateSlots(doctorId) {
        await this.findOne(doctorId);
        const allSlots = await this.prisma.availableSlot.findMany({
            where: {
                doctorId,
                isBooked: false,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
        const slotsByTime = new Map();
        for (const slot of allSlots) {
            const timeKey = slot.startTime.toISOString();
            if (!slotsByTime.has(timeKey)) {
                slotsByTime.set(timeKey, []);
            }
            slotsByTime.get(timeKey).push(slot);
        }
        const duplicateIds = [];
        for (const [timeKey, slots] of slotsByTime.entries()) {
            if (slots.length > 1) {
                const [keep, ...remove] = slots;
                duplicateIds.push(...remove.map(s => s.id));
                console.log(`Horario ${timeKey}: Manteniendo ${keep.id}, eliminando ${remove.length} duplicados`);
            }
        }
        if (duplicateIds.length > 0) {
            await this.prisma.availableSlot.deleteMany({
                where: {
                    id: {
                        in: duplicateIds,
                    },
                },
            });
        }
        return {
            totalSlotsReviewed: allSlots.length,
            duplicatesRemoved: duplicateIds.length,
            uniqueSlotsRemaining: slotsByTime.size,
            message: duplicateIds.length > 0
                ? `Se eliminaron ${duplicateIds.length} turnos duplicados. Quedan ${slotsByTime.size} turnos únicos.`
                : 'No se encontraron turnos duplicados.',
        };
    }
    async removeDuplicateSlotsForAll() {
        const doctors = await this.prisma.doctor.findMany({
            select: { id: true, name: true },
        });
        const results = [];
        for (const doctor of doctors) {
            const result = await this.removeDuplicateSlots(doctor.id);
            results.push({
                doctorId: doctor.id,
                doctorName: doctor.name,
                ...result,
            });
        }
        const totalRemoved = results.reduce((sum, r) => sum + r.duplicatesRemoved, 0);
        return {
            doctorsProcessed: doctors.length,
            totalDuplicatesRemoved: totalRemoved,
            details: results,
        };
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map