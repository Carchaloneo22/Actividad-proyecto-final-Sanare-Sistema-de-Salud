import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UserEntity } from '../auth/entities/user.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(status?: AppointmentStatus, user?: UserEntity): Promise<({
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
    getStats(): Promise<{
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    }>;
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
    create(createDto: CreateAppointmentDto, user: UserEntity): Promise<{
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
    cancel(id: string, user: UserEntity): Promise<{
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
}
export declare class AppointmentsPublicController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
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
}
