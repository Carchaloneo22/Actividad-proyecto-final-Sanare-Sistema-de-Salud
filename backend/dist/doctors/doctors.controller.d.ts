import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
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
    getAvailableSlots(id: string, dateString: string): Promise<{
        id: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
    }[]>;
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
    createSlot(id: string, slotDto: {
        startTime: string;
        endTime: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }>;
    generateSlots(id: string, generateDto: {
        daysOfWeek: number[];
        startHour: number;
        endHour: number;
        weeksAhead?: number;
    }): Promise<{
        created: number;
        message: string;
        slots: {
            id: any;
            startTime: any;
            endTime: any;
            isBooked: any;
        }[];
    }>;
    clearSlots(id: string): Promise<{
        deleted: number;
    }>;
    removeDuplicates(id: string): Promise<{
        totalSlotsReviewed: number;
        duplicatesRemoved: number;
        uniqueSlotsRemaining: number;
        message: string;
    }>;
    removeAllDuplicates(): Promise<{
        doctorsProcessed: number;
        totalDuplicatesRemoved: any;
        details: any[];
    }>;
}
