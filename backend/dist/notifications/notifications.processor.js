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
var NotificationsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../common/prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const common_1 = require("@nestjs/common");
let NotificationsProcessor = NotificationsProcessor_1 = class NotificationsProcessor {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(NotificationsProcessor_1.name);
    }
    async handleAppointmentConfirmed(job) {
        const { appointmentId, patientName, patientEmail, patientPhone, doctorName, specialty, date, } = job.data;
        console.log('📧 Enviando notificación de confirmación de turno:');
        console.log(`   Paciente: ${patientName}`);
        console.log(`   Email: ${patientEmail || 'No proporcionado'}`);
        console.log(`   Teléfono: ${patientPhone}`);
        console.log(`   Doctor: ${doctorName}`);
        console.log(`   Especialidad: ${specialty}`);
        console.log(`   Fecha: ${new Date(date).toLocaleString('es-AR')}`);
        console.log(`   ID Turno: ${appointmentId}`);
        return { sent: true, message: 'Notificación enviada (simulada)' };
    }
    async handleSlotAvailable(job) {
        const { doctorId, specialtyId, date } = job.data;
        const waitingList = await this.prisma.waitingList.findMany({
            where: {
                specialtyId,
                notified: false,
            },
            take: 5,
        });
        console.log('🔔 Turno liberado - Notificando lista de espera:');
        console.log(`   Especialidad ID: ${specialtyId}`);
        console.log(`   Fecha: ${new Date(date).toLocaleString('es-AR')}`);
        console.log(`   Personas a notificar: ${waitingList.length}`);
        for (const person of waitingList) {
            console.log(`   📱 Notificando a: ${person.patientName} (${person.patientPhone})`);
            await this.prisma.waitingList.update({
                where: { id: person.id },
                data: { notified: true },
            });
        }
        return { notified: waitingList.length };
    }
    async handleDailyReminders(job) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(23, 59, 59, 999);
        const appointments = await this.prisma.appointment.findMany({
            where: {
                date: {
                    gte: tomorrow,
                    lte: tomorrowEnd,
                },
                status: 'CONFIRMED',
            },
            include: {
                doctor: {
                    include: { specialty: true },
                },
            },
        });
        console.log('⏰ Enviando recordatorios diarios:');
        console.log(`   Turnos para mañana: ${appointments.length}`);
        for (const apt of appointments) {
            console.log(`   📱 Recordatorio a: ${apt.patientName}`);
            console.log(`      Doctor: ${apt.doctor.name}`);
            console.log(`      Hora: ${new Date(apt.date).toLocaleTimeString('es-AR')}`);
        }
        return { sent: appointments.length };
    }
    async handleAppointmentReminder(job) {
        this.logger.log(`Processing appointment reminder for: ${job.data.patientEmail}`);
        try {
            await this.mailService.sendAppointmentReminder(job.data.patientEmail, job.data.patientName, job.data.doctorName, job.data.specialty, new Date(job.data.date), job.data.hospital);
            this.logger.log(`Reminder email sent successfully to ${job.data.patientEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send reminder email to ${job.data.patientEmail}:`, error);
            throw error;
        }
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
__decorate([
    (0, bull_1.Process)('appointment-confirmed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAppointmentConfirmed", null);
__decorate([
    (0, bull_1.Process)('slot-available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleSlotAvailable", null);
__decorate([
    (0, bull_1.Process)('daily-reminders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleDailyReminders", null);
__decorate([
    (0, bull_1.Process)('appointment-reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsProcessor.prototype, "handleAppointmentReminder", null);
exports.NotificationsProcessor = NotificationsProcessor = NotificationsProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('notifications'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map