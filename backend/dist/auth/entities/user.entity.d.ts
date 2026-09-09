import { UserRole } from '@prisma/client';
export declare class UserEntity {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dni?: string | null;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserEntity>);
}
