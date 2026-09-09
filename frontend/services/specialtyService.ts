import { Specialty } from '../types/doctor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SpecialtyService {
  async getAll(): Promise<Specialty[]> {
    const response = await fetch(`${API_URL}/specialties`);

    if (!response.ok) {
      throw new Error('Error al obtener especialidades');
    }

    return response.json();
  }
}

export const specialtyService = new SpecialtyService();
