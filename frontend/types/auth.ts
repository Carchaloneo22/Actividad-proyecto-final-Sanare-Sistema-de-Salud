export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dni: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dni?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
