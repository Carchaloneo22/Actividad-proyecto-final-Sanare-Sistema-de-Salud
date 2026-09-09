import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    private initializeTransporter;
    private sendEmail;
    sendWelcomeEmail(email: string, firstName: string, lastName: string): Promise<void>;
    sendAppointmentConfirmation(email: string, patientName: string, doctorName: string, specialty: string, date: Date, hospital: string): Promise<void>;
    sendAppointmentReminder(email: string, patientName: string, doctorName: string, specialty: string, date: Date, hospital: string): Promise<void>;
    sendAppointmentCancellation(email: string, patientName: string, doctorName: string, specialty: string, date: Date): Promise<void>;
    sendAppointmentUpdate(email: string, patientName: string, doctorName: string, specialty: string, oldDate: Date, newDate: Date, hospital: string): Promise<void>;
}
