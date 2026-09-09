import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Process('appointment-confirmed')
  async handleAppointmentConfirmed(job: Job) {
    const {
      appointmentId,
      patientName,
      patientEmail,
      patientPhone,
      doctorName,
      specialty,
      date,
    } = job.data;

    console.log('📧 Enviando notificación de confirmación de turno:');
    console.log(`   Paciente: ${patientName}`);
    console.log(`   Email: ${patientEmail || 'No proporcionado'}`);
    console.log(`   Teléfono: ${patientPhone}`);
    console.log(`   Doctor: ${doctorName}`);
    console.log(`   Especialidad: ${specialty}`);
    console.log(`   Fecha: ${new Date(date).toLocaleString('es-AR')}`);
    console.log(`   ID Turno: ${appointmentId}`);

    // TODO: Aquí iría la integración real con servicio de email/SMS
    // Ejemplos:
    // - SendGrid para emails
    // - Twilio para SMS
    // - OneSignal para push notifications

    return { sent: true, message: 'Notificación enviada (simulada)' };
  }

  @Process('slot-available')
  async handleSlotAvailable(job: Job) {
    const { doctorId, specialtyId, date } = job.data;

    // Buscar personas en lista de espera para esta especialidad
    const waitingList = await this.prisma.waitingList.findMany({
      where: {
        specialtyId,
        notified: false,
      },
      take: 5, // Notificar a las primeras 5 personas
    });

    console.log('🔔 Turno liberado - Notificando lista de espera:');
    console.log(`   Especialidad ID: ${specialtyId}`);
    console.log(`   Fecha: ${new Date(date).toLocaleString('es-AR')}`);
    console.log(`   Personas a notificar: ${waitingList.length}`);

    for (const person of waitingList) {
      console.log(`   📱 Notificando a: ${person.patientName} (${person.patientPhone})`);

      // Marcar como notificado
      await this.prisma.waitingList.update({
        where: { id: person.id },
        data: { notified: true },
      });
    }

    // TODO: Implementar envío real de notificaciones
    return { notified: waitingList.length };
  }

  @Process('daily-reminders')
  async handleDailyReminders(job: Job) {
    // Buscar turnos para mañana
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

    // TODO: Implementar envío real de recordatorios
    return { sent: appointments.length };
  }

  @Process('appointment-reminder')
  async handleAppointmentReminder(job: Job) {
    this.logger.log(
      `Processing appointment reminder for: ${job.data.patientEmail}`,
    );

    try {
      await this.mailService.sendAppointmentReminder(
        job.data.patientEmail,
        job.data.patientName,
        job.data.doctorName,
        job.data.specialty,
        new Date(job.data.date),
        job.data.hospital,
      );

      this.logger.log(
        `Reminder email sent successfully to ${job.data.patientEmail}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send reminder email to ${job.data.patientEmail}:`,
        error,
      );
      throw error;
    }
  }
}
