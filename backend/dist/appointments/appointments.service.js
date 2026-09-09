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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../common/prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, mailService, notificationQueue) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationQueue = notificationQueue;
    }
    async findAll(status) {
        return this.prisma.appointment.findMany({
            where: status ? { status } : undefined,
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.appointment.findUnique({
            where: { id },
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
        });
    }
    async create(data) {
        const cancellationToken = crypto.randomBytes(32).toString('hex');
        const appointment = await this.prisma.$transaction(async (tx) => {
            const slot = await tx.availableSlot.findFirst({
                where: {
                    doctorId: data.doctorId,
                    startTime: { lte: data.date },
                    endTime: { gte: data.date },
                    isBooked: false,
                },
            });
            if (!slot) {
                throw new common_1.BadRequestException('El horario seleccionado no está disponible');
            }
            await tx.availableSlot.update({
                where: { id: slot.id },
                data: { isBooked: true },
            });
            const newAppointment = await tx.appointment.create({
                data: {
                    ...data,
                    status: client_1.AppointmentStatus.CONFIRMED,
                    cancellationToken,
                },
                include: {
                    doctor: {
                        include: { specialty: true },
                    },
                },
            });
            return newAppointment;
        });
        if (appointment.patientEmail) {
            this.mailService
                .sendAppointmentConfirmation(appointment.patientEmail, appointment.patientName, appointment.doctor.name, appointment.doctor.specialty.name, appointment.date, appointment.doctor.hospital)
                .catch((error) => {
                console.error('Error sending confirmation email:', error);
            });
        }
        await this.notificationQueue.add('appointment-confirmed', {
            appointmentId: appointment.id,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail,
            patientPhone: appointment.patientPhone,
            doctorName: appointment.doctor.name,
            specialty: appointment.doctor.specialty.name,
            date: appointment.date,
        });
        const reminderTime = new Date(appointment.date);
        reminderTime.setHours(reminderTime.getHours() - 24);
        const delay = reminderTime.getTime() - Date.now();
        if (delay > 0 && appointment.patientEmail) {
            await this.notificationQueue.add('appointment-reminder', {
                appointmentId: appointment.id,
                patientEmail: appointment.patientEmail,
                patientName: appointment.patientName,
                doctorName: appointment.doctor.name,
                specialty: appointment.doctor.specialty.name,
                date: appointment.date,
                hospital: appointment.doctor.hospital,
            }, { delay });
        }
        return appointment;
    }
    async cancel(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { doctor: true },
        });
        if (!appointment) {
            throw new common_1.BadRequestException('Turno no encontrado');
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: client_1.AppointmentStatus.CANCELLED },
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
        });
        await this.prisma.availableSlot.updateMany({
            where: {
                doctorId: appointment.doctorId,
                startTime: { lte: appointment.date },
                endTime: { gte: appointment.date },
            },
            data: { isBooked: false },
        });
        if (updated.patientEmail) {
            this.mailService
                .sendAppointmentCancellation(updated.patientEmail, updated.patientName, updated.doctor.name, updated.doctor.specialty.name, updated.date)
                .catch((error) => {
                console.error('Error sending cancellation email:', error);
            });
        }
        await this.notificationQueue.add('slot-available', {
            doctorId: appointment.doctorId,
            specialtyId: appointment.doctor.specialtyId,
            date: appointment.date,
        });
        return updated;
    }
    async cancelByToken(token) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { cancellationToken: token },
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
        });
        if (!appointment) {
            throw new common_1.BadRequestException('Token de cancelación inválido');
        }
        if (appointment.status === client_1.AppointmentStatus.CANCELLED) {
            throw new common_1.BadRequestException('Este turno ya fue cancelado');
        }
        if (appointment.date < new Date()) {
            throw new common_1.BadRequestException('No se puede cancelar un turno que ya pasó');
        }
        return this.cancel(appointment.id);
    }
    async getByToken(token) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { cancellationToken: token },
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
        });
        if (!appointment) {
            throw new common_1.BadRequestException('Token inválido');
        }
        return appointment;
    }
    async getStats() {
        const total = await this.prisma.appointment.count();
        const confirmed = await this.prisma.appointment.count({
            where: { status: client_1.AppointmentStatus.CONFIRMED },
        });
        const pending = await this.prisma.appointment.count({
            where: { status: client_1.AppointmentStatus.PENDING },
        });
        const cancelled = await this.prisma.appointment.count({
            where: { status: client_1.AppointmentStatus.CANCELLED },
        });
        return { total, confirmed, pending, cancelled };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService, Object])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map