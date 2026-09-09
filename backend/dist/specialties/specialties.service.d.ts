import { PrismaService } from '../common/prisma/prisma.service';
export declare class SpecialtiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            doctors: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        doctors: ({
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
            name: string;
            email: string;
            phone: string | null;
            userId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            hospital: string;
        })[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        name: string;
        description?: string;
    }): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
