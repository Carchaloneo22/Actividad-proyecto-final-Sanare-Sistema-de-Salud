const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      return { error: error.message || `Error ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error instanceof Error ? error.message : 'Error de conexión' };
  }
}

// Specialties
export async function getAllSpecialties() {
  return fetchAPI('/specialties', { method: 'GET' });
}

export async function getSpecialtyById(id: string) {
  return fetchAPI(`/specialties/${id}`, { method: 'GET' });
}

// Doctors
export async function getAllDoctors(specialtyId?: string) {
  const query = specialtyId ? `?specialtyId=${specialtyId}` : '';
  return fetchAPI(`/doctors${query}`, { method: 'GET' });
}

export async function getDoctorById(id: string) {
  return fetchAPI(`/doctors/${id}`, { method: 'GET' });
}

// Appointments
export async function getAllAppointments(status?: string) {
  const query = status ? `?status=${status}` : '';
  return fetchAPI(`/appointments${query}`, { method: 'GET' });
}

export async function getAppointmentStats() {
  return fetchAPI('/appointments/stats', { method: 'GET' });
}

export async function createAppointment(data: {
  doctorId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  date: string;
  notes?: string;
}) {
  return fetchAPI('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelAppointment(id: string) {
  return fetchAPI(`/appointments/${id}`, { method: 'DELETE' });
}
