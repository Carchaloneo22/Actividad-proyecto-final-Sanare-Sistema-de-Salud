import { AppointmentStatus } from '@prisma/client';
export declare class AppointmentEntity {
    id: string;
    doctorId: string;
    userId: string;
    patientName: string;
    patientEmail: string | null;
    patientPhone: string;
    date: Date;
    notes: string | null;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
}
