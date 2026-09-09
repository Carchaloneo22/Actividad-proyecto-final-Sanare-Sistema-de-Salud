import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { Doctor, Specialty, AppointmentWithDetails } from '../types/doctor';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

interface AvailableSlot {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

const AppointmentScheduler: React.FC = () => {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState({
    specialties: true,
    doctors: false,
    slots: false,
    booking: false
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Cargar especialidades al montar
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await doctorService.getSpecialties();
        setSpecialties(data);
      } catch (err) {
        setError('Error al cargar las especialidades');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, specialties: false }));
      }
    };

    loadSpecialties();
  }, []);

  // Prellenar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      setPatientName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
      setPatientEmail(user.email || '');
      setPatientPhone(user.phone || '');
    }
  }, [user]);

  // Cargar doctores cuando cambia la especialidad
  useEffect(() => {
    const loadDoctors = async () => {
      if (!selectedSpecialtyId) {
        setDoctors([]);
        setSelectedDoctor(null);
        return;
      }

      setLoading(prev => ({ ...prev, doctors: true }));
      setError('');
      
      try {
        const data = await doctorService.getAll(selectedSpecialtyId);
        setDoctors(data);
      } catch (err) {
        setError('Error al cargar los médicos');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    loadDoctors();
  }, [selectedSpecialtyId]);

  // Cargar slots disponibles cuando se selecciona un médico y una fecha
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        setSelectedSlot(null);
        return;
      }

      setLoading(prev => ({ ...prev, slots: true }));
      setError('');
      
      try {
        // Obtener los slots disponibles del backend
        const slots = await doctorService.getAvailableSlots(selectedDoctor.id, selectedDate);
        
        // Ordenar los slots por hora de inicio
        const sortedSlots = [...slots].sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        
        // Filtrar para asegurarnos de que solo mostramos slots futuros
        const now = new Date();
        const futureSlots = sortedSlots.filter(slot => new Date(slot.startTime) > now);
        
        setAvailableSlots(futureSlots);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los horarios disponibles');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, slots: false }));
      }
    };

    loadAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  // Generar días del mes para el calendario
  const generateCalendarDays = () => {
    if (!selectedDoctor) return [];
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formatear hora para mostrar
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);

    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedSlot || !patientName || !patientPhone) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(prev => ({ ...prev, booking: true }));
    setError('');

    try {
      // IMPORTANTE: Enviar la fecha tal como está en el slot, sin conversiones adicionales
      // El backend espera un string ISO que representa la hora exacta del turno
      await appointmentService.create({
        doctorId: selectedDoctor.id,
        patientName,
        patientPhone,
        patientEmail: patientEmail || undefined,
        date: selectedSlot.startTime, // Ya es un string ISO del backend
        notes: notes || undefined,
      });

      // Desactivar loading primero
      setLoading(prev => ({ ...prev, booking: false }));

      // Mostrar mensaje de éxito
      setBookingSuccess(true);

      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedSlot(null);
        setPatientName('');
        setPatientPhone('');
        setNotes('');
      }, 3000);

    } catch (err: any) {
      setLoading(prev => ({ ...prev, booking: false }));
      setError(err.message || 'Error al reservar el turno');
      console.error(err);
    }
  };

  // Navegar al mes anterior/siguiente
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h1 className="text-2xl font-bold">Solicitud de Turno</h1>
          <p className="text-blue-100">Complete el formulario para reservar su turno</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {bookingSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-6 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <p>¡Turno reservado con éxito! Recibirás un correo de confirmación.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Paso 1: Seleccionar especialidad */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Seleccione la especialidad</h2>
            <div className="relative">
              <select
                value={selectedSpecialtyId}
                onChange={(e) => {
                  setSelectedSpecialtyId(e.target.value);
                  setSelectedDoctor(null);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading.specialties || loading.doctors}
                required
              >
                <option value="">Seleccione una especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              {loading.specialties && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Paso 2: Seleccionar médico */}
          {selectedSpecialtyId && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">2. Seleccione el médico</h2>
              {loading.doctors ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : doctors.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700">No hay médicos disponibles para esta especialidad.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setSelectedDate(null);
                        setSelectedSlot(null);
                      }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {doctor.hospital}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {doctor.specialty?.name || 'Especialidad no disponible'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Seleccionar fecha */}
          {selectedDoctor && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">3. Seleccione la fecha</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h3 className="font-semibold text-gray-800">
                    {currentMonth.toLocaleDateString('es-AR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="h-10" />;
                    }

                    const isToday = new Date().toDateString() === date.toDateString();
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                    const isPast = date < new Date() && !isToday;

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        disabled={isPast}
                        className={`h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : isToday
                            ? 'bg-blue-100 text-blue-800'
                            : isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Seleccionar horario */}
          {selectedDate && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                4. Seleccione el horario para el {formatDate(selectedDate)}
              </h2>
              {loading.slots ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700">
                    No hay horarios disponibles para esta fecha. Por favor, seleccione otra fecha.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Horarios disponibles:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const slotTime = new Date(slot.startTime);
                        const timeStr = slotTime.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        });

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 border rounded-lg text-center transition-all ${
                              selectedSlot?.id === slot.id
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            <span className="font-medium">{timeStr}</span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        No hay horarios disponibles para esta fecha.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 5: Datos del paciente */}
          {selectedSlot && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">5. Complete sus datos</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="patientPhone"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="patientEmail"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Motivo de la consulta, alergias, etc."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading.booking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading.booking ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Confirmar turno'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
