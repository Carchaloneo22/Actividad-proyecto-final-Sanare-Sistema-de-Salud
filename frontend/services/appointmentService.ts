import { AppointmentWithDetails } from '../types/doctor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class AppointmentService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAll(status?: string): Promise<AppointmentWithDetails[]> {
    const url = status
      ? `${API_URL}/appointments?status=${status}`
      : `${API_URL}/appointments`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener turnos');
    }

    return response.json();
  }

  async getByDate(date: Date): Promise<AppointmentWithDetails[]> {
    const appointments = await this.getAll();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfDay && aptDate <= endOfDay;
    });
  }

  async cancel(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cancelar turno');
    }
  }

  async create(data: {
    doctorId: string;
    patientName: string;
    patientEmail?: string;
    patientPhone: string;
    date: string;
    notes?: string;
  }): Promise<AppointmentWithDetails> {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear turno');
    }

    return response.json();
  }
}

export const appointmentService = new AppointmentService();
