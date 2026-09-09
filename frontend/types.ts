export enum Specialty {
  GENERAL = 'Medicina General',
  PEDIATRICS = 'Pediatría',
  CARDIOLOGY = 'Cardiología',
  TRAUMATOLOGY = 'Traumatología',
  GYNECOLOGY = 'Ginecología',
  DERMATOLOGY = 'Dermatología',
  NEUROLOGY = 'Neurología',
  UNKNOWN = 'Consulta General'
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  hospital: string;
  availableSlots: string[]; // ISO Date strings
}

export interface TriageResult {
  recommendedSpecialty: Specialty;
  urgency: 'Baja' | 'Media' | 'Alta';
  reasoning: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export enum ViewState {
  HOME = 'HOME',
  TRIAGE = 'TRIAGE',
  BOOKING = 'BOOKING',
  ADMIN = 'ADMIN'
}