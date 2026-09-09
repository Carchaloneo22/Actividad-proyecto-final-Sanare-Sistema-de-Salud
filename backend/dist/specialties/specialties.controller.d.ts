import { SpecialtiesService } from './specialties.service';
export declare class SpecialtiesController {
    private readonly specialtiesService;
    constructor(specialtiesService: SpecialtiesService);
    findAll(): Promise<({
        _count: {
            doctors: number;
        };
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
            id: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            specialtyId: string;
            hospital: string;
            userId: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    create(createDto: {
        name: string;
        description?: string;
    }): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
}
