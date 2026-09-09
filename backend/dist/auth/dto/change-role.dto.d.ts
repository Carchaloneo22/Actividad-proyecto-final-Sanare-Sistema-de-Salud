import { UserRole } from '@prisma/client';
export declare class ChangeRoleDto {
    userId: string;
    newRole: UserRole;
}
