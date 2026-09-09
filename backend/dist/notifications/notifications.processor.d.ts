import { Job } from 'bull';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class NotificationsProcessor {
    private prisma;
    private mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    handleAppointmentConfirmed(job: Job): Promise<{
        sent: boolean;
        message: string;
    }>;
    handleSlotAvailable(job: Job): Promise<{
        notified: number;
    }>;
    handleDailyReminders(job: Job): Promise<{
        sent: number;
    }>;
    handleAppointmentReminder(job: Job): Promise<void>;
}
