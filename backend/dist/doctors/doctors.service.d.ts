import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(specialtyId?: string): Promise<({
        specialty: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        _count: {
            appointments: number;
        };
        availableSlots: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        }[];
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
    })[]>;
    findOne(id: string): Promise<{
        specialty: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        availableSlots: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        }[];
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
    }>;
    create(createDto: CreateDoctorDto): Promise<{
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
    }>;
    update(id: string, updateDto: UpdateDoctorDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        specialtyId: string;
        hospital: string;
        userId: string | null;
    }>;
    createAvailableSlot(doctorId: string, startTime: Date, endTime: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }>;
    generateWeekSlots(doctorId: string, daysOfWeek: number[], startHour: number, endHour: number, weeksAhead?: number): Promise<{
        created: number;
        message: string;
        slots: {
            id: any;
            startTime: any;
            endTime: any;
            isBooked: any;
        }[];
    }>;
    getAvailableSlots(doctorId: string, date: Date): Promise<{
        id: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
    }[]>;
    clearAllSlots(doctorId: string): Promise<{
        deleted: number;
    }>;
    removeDuplicateSlots(doctorId: string): Promise<{
        totalSlotsReviewed: number;
        duplicatesRemoved: number;
        uniqueSlotsRemaining: number;
        message: string;
    }>;
    removeDuplicateSlotsForAll(): Promise<{
        doctorsProcessed: number;
        totalDuplicatesRemoved: any;
        details: any[];
    }>;
}
