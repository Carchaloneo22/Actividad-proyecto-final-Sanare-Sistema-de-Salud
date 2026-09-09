import { Queue } from 'bull';
import { PrismaService } from '../common/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AppointmentStatus } from '@prisma/client';
export declare class AppointmentsService {
    private prisma;
    private mailService;
    private notificationQueue;
    constructor(prisma: PrismaService, mailService: MailService, notificationQueue: Queue);
    findAll(status?: AppointmentStatus): Promise<({
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    })[]>;
    findOne(id: string): Promise<{
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    }>;
    create(data: {
        doctorId: string;
        userId: string;
        patientName: string;
        patientEmail?: string;
        patientPhone: string;
        date: Date;
        notes?: string;
    }): Promise<{
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    }>;
    cancel(id: string): Promise<{
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    }>;
    cancelByToken(token: string): Promise<{
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    }>;
    getByToken(token: string): Promise<{
        doctor: {
            specialty: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        doctorId: string;
        date: Date;
        patientName: string;
        patientEmail: string | null;
        patientPhone: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        cancellationToken: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    }>;
}
