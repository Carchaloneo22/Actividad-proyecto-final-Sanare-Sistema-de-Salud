import { Doctor, CreateDoctorData, UpdateDoctorData, Specialty } from '../types/doctor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class DoctorService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAll(specialtyId?: string): Promise<Doctor[]> {
    const url = specialtyId
      ? `${API_URL}/doctors?specialtyId=${specialtyId}`
      : `${API_URL}/doctors`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener doctores');
    }

    return response.json();
  }

  async getOne(id: string): Promise<Doctor> {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener doctor');
    }

    return response.json();
  }

  async create(data: CreateDoctorData): Promise<Doctor> {
    const response = await fetch(`${API_URL}/doctors`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear doctor');
    }

    return response.json();
  }

  async update(id: string, data: UpdateDoctorData): Promise<Doctor> {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar doctor');
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar doctor');
    }
  }

  async getSpecialties(): Promise<Specialty[]> {
    const response = await fetch(`${API_URL}/specialties`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener especialidades');
    }

    return response.json();
  }

  async getAvailableSlots(doctorId: string, date: Date): Promise<{
    id: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }[]> {
    const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const response = await fetch(
      `${API_URL}/doctors/${doctorId}/available-slots?date=${dateStr}`, 
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener horarios disponibles');
    }

    return response.json();
  }
}

export const doctorService = new DoctorService();
