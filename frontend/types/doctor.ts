export interface Specialty {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  hospital: string;
  specialtyId: string;
  specialty?: Specialty;
  createdAt: string;
  updatedAt: string;
  _count?: {
    appointments: number;
  };
}

export interface CreateDoctorData {
  name: string;
  email: string;
  phone: string;
  hospital: string;
  specialtyId: string;
}

export interface UpdateDoctorData extends Partial<CreateDoctorData> {}

export interface AppointmentWithDetails {
  id: string;
  doctorId: string;
  userId: string;
  patientName: string;
  patientEmail: string | null;
  patientPhone: string;
  date: string;
  notes: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
