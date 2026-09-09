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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.initializeTransporter();
    }
    async initializeTransporter() {
        const emailHost = this.configService.get('EMAIL_HOST');
        const emailPort = this.configService.get('EMAIL_PORT');
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPass = this.configService.get('EMAIL_PASS');
        if (emailHost && emailUser && emailPass) {
            this.transporter = nodemailer.createTransport({
                host: emailHost,
                port: emailPort || 587,
                secure: emailPort === 465,
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });
            this.logger.log('Email transporter configured with production credentials');
        }
        else {
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            this.logger.warn('Email transporter configured with TEST account (Ethereal)');
            this.logger.warn(`Test account: ${testAccount.user}`);
        }
    }
    async sendEmail(options) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get('EMAIL_FROM') || '"SaludPública Connect" <noreply@saludpublica.com>',
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            this.logger.log(`Email sent to ${options.to}: ${info.messageId}`);
            if (process.env.NODE_ENV !== 'production') {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    this.logger.log(`Preview URL: ${previewUrl}`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            throw error;
        }
    }
    async sendWelcomeEmail(email, firstName, lastName) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a SaludPública Connect!</h1>
            </div>
            <div class="content">
              <h2>Hola ${firstName} ${lastName},</h2>
              <p>Gracias por registrarte en nuestro sistema de gestión de turnos médicos.</p>
              <p>Con SaludPública Connect podrás:</p>
              <ul>
                <li>✅ Reservar turnos médicos de forma rápida y sencilla</li>
                <li>🤖 Usar nuestro sistema de triaje inteligente con IA</li>
                <li>📅 Gestionar tus citas médicas en un solo lugar</li>
                <li>🔔 Recibir recordatorios automáticos de tus turnos</li>
              </ul>
              <p>Ahora puedes iniciar sesión y comenzar a agendar tus turnos.</p>
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3002'}/login" class="button">
                Iniciar Sesión
              </a>
            </div>
            <div class="footer">
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              <p>© 2025 SaludPública Connect - Sistema Público de Gestión de Turnos</p>
            </div>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: '¡Bienvenido a SaludPública Connect! 🎉',
            html,
            text: `Hola ${firstName} ${lastName}, bienvenido a SaludPública Connect. Ya puedes iniciar sesión y comenzar a agendar tus turnos médicos.`,
        });
    }
    async sendAppointmentConfirmation(email, patientName, doctorName, specialty, date, hospital) {
        const formattedDate = new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires',
        }).format(date);
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3002';
        const loginUrl = `${frontendUrl}/login`;
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-card { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #1f2937; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Turno Confirmado</h1>
            </div>
            <div class="content">
              <h2>Hola ${patientName},</h2>
              <p>Tu turno ha sido confirmado exitosamente. Aquí están los detalles:</p>

              <div class="appointment-card">
                <div class="info-row">
                  <span class="label">📅 Fecha y Hora:</span><br>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="info-row">
                  <span class="label">👨‍⚕️ Doctor:</span><br>
                  <span class="value">${doctorName}</span>
                </div>
                <div class="info-row">
                  <span class="label">🩺 Especialidad:</span><br>
                  <span class="value">${specialty}</span>
                </div>
                <div class="info-row">
                  <span class="label">🏥 Hospital:</span><br>
                  <span class="value">${hospital}</span>
                </div>
              </div>

              <p><strong>⏰ Importante:</strong> Te enviaremos un recordatorio 24 horas antes de tu cita.</p>
              <p>Por favor, llega con 15 minutos de anticipación y trae tu DNI.</p>

              <div class="button-container">
                <a href="${loginUrl}" class="button">Ver mis Turnos en la App</a>
              </div>

              <p style="font-size: 12px; color: #6b7280;">
                Si necesitas cancelar o modificar tu turno, ingresa a la aplicación.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 SaludPública Connect</p>
            </div>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: `✅ Turno confirmado - ${doctorName} (${specialty})`,
            html,
            text: `Tu turno con ${doctorName} (${specialty}) ha sido confirmado para el ${formattedDate} en ${hospital}.`,
        });
    }
    async sendAppointmentReminder(email, patientName, doctorName, specialty, date, hospital) {
        const formattedDate = new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires',
        }).format(date);
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-card { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #92400e; }
            .value { color: #1f2937; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Recordatorio de Turno</h1>
            </div>
            <div class="content">
              <h2>Hola ${patientName},</h2>
              <p><strong>Este es un recordatorio de que tienes un turno médico mañana.</strong></p>

              <div class="reminder-card">
                <div class="info-row">
                  <span class="label">📅 Fecha y Hora:</span><br>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="info-row">
                  <span class="label">👨‍⚕️ Doctor:</span><br>
                  <span class="value">${doctorName}</span>
                </div>
                <div class="info-row">
                  <span class="label">🩺 Especialidad:</span><br>
                  <span class="value">${specialty}</span>
                </div>
                <div class="info-row">
                  <span class="label">🏥 Hospital:</span><br>
                  <span class="value">${hospital}</span>
                </div>
              </div>

              <p><strong>📋 Recordatorios importantes:</strong></p>
              <ul>
                <li>Llega con 15 minutos de anticipación</li>
                <li>Trae tu DNI y credencial de obra social/mutual</li>
                <li>Si no puedes asistir, cancela el turno para que otro paciente pueda usarlo</li>
              </ul>
            </div>
            <div class="footer">
              <p>Si necesitas cancelar, ingresa a tu cuenta lo antes posible.</p>
              <p>© 2025 SaludPública Connect</p>
            </div>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: `🔔 Recordatorio: Turno mañana con ${doctorName}`,
            html,
            text: `Recordatorio: Tienes un turno mañana ${formattedDate} con ${doctorName} (${specialty}) en ${hospital}.`,
        });
    }
    async sendAppointmentCancellation(email, patientName, doctorName, specialty, date) {
        const formattedDate = new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires',
        }).format(date);
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .cancel-card { background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Turno Cancelado</h1>
            </div>
            <div class="content">
              <h2>Hola ${patientName},</h2>
              <p>Tu turno ha sido cancelado:</p>

              <div class="cancel-card">
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Especialidad:</strong> ${specialty}</p>
                <p><strong>Fecha:</strong> ${formattedDate}</p>
              </div>

              <p>Si necesitas agendar un nuevo turno, puedes hacerlo desde tu cuenta.</p>

              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3002'}/booking" class="button">
                Agendar Nuevo Turno
              </a>
            </div>
            <div class="footer">
              <p>© 2025 SaludPública Connect</p>
            </div>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: `❌ Turno cancelado - ${doctorName}`,
            html,
            text: `Tu turno con ${doctorName} (${specialty}) para el ${formattedDate} ha sido cancelado.`,
        });
    }
    async sendAppointmentUpdate(email, patientName, doctorName, specialty, oldDate, newDate, hospital) {
        const formattedOldDate = new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires',
        }).format(oldDate);
        const formattedNewDate = new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Argentina/Buenos_Aires',
        }).format(newDate);
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .update-card { background: white; border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .old-date { text-decoration: line-through; color: #6b7280; }
            .new-date { color: #8b5cf6; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 Turno Modificado</h1>
            </div>
            <div class="content">
              <h2>Hola ${patientName},</h2>
              <p>Tu turno ha sido modificado:</p>

              <div class="update-card">
                <p><strong>👨‍⚕️ Doctor:</strong> ${doctorName}</p>
                <p><strong>🩺 Especialidad:</strong> ${specialty}</p>
                <p><strong>🏥 Hospital:</strong> ${hospital}</p>
                <hr>
                <p><strong>📅 Fecha anterior:</strong><br>
                <span class="old-date">${formattedOldDate}</span></p>
                <p><strong>📅 Nueva fecha:</strong><br>
                <span class="new-date">${formattedNewDate}</span></p>
              </div>

              <p>Te enviaremos un recordatorio 24 horas antes de tu nueva cita.</p>
            </div>
            <div class="footer">
              <p>© 2025 SaludPública Connect</p>
            </div>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: `📝 Turno modificado - ${doctorName}`,
            html,
            text: `Tu turno con ${doctorName} ha sido modificado. Nueva fecha: ${formattedNewDate}`,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map