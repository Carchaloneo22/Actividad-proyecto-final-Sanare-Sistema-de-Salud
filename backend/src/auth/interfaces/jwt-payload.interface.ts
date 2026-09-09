import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
