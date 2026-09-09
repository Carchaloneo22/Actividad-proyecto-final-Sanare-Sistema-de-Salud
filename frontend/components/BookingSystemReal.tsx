import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Specialty, Doctor } from '../types/doctor';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

interface AvailableSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface DoctorWithSlots extends Doctor {
  availableSlots?: AvailableSlot[];
}

const BookingSystemReal: React.FC = () => {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithSlots[]>([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithSlots | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar especialidades al montar
  useEffect(() => {
    loadSpecialties();
  }, []);

  // Prellenar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      setPatientName(`${user.firstName} ${user.lastName}`);
      setPatientEmail(user.email);
    }
  }, [user]);

  // Cargar doctores cuando cambia la especialidad
  useEffect(() => {
    if (selectedSpecialtyId) {
      loadDoctors(selectedSpecialtyId);
    } else {
      setDoctors([]);
      setSelectedDoctor(null);
      setSelectedSlot(null);
    }
  }, [selectedSpecialtyId]);

  const loadSpecialties = async () => {
    try {
      const data = await doctorService.getSpecialties();
      setSpecialties(data);
    } catch (err) {
      setError('Error al cargar especialidades');
      console.error(err);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  const loadDoctors = async (specialtyId: string) => {
    setLoadingDoctors(true);
    setError('');
    try {
      const data = await doctorService.getAll(specialtyId);
      setDoctors(data);
      if (data.length === 0) {
        setError('No hay médicos disponibles para esta especialidad');
      }
    } catch (err) {
      setError('Error al cargar médicos');
      console.error(err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctor || !selectedSlot || !patientName || !patientPhone) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      await appointmentService.create({
        doctorId: selectedDoctor.id,
        patientName,
        patientEmail: patientEmail || undefined,
        patientPhone,
        date: selectedSlot.startTime,
        notes: notes || undefined,
      });

      setBookingSuccess(true);

      // Reset form después de 3 segundos
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedSpecialtyId('');
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setPatientName(user ? `${user.firstName} ${user.lastName}` : '');
        setPatientPhone('');
        setPatientEmail(user?.email || '');
        setNotes('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al reservar el turno');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loadingSpecialties) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Reservar Turno</h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {bookingSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Turno Confirmado!</h3>
            <p className="text-green-700">
              Recibirás un mensaje de confirmación en tu {patientEmail ? 'email' : 'teléfono'}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-6">
            {/* Especialidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidad Médica <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSpecialtyId}
                onChange={(e) => {
                  setSelectedSpecialtyId(e.target.value);
                  setSelectedDoctor(null);
                  setSelectedSlot(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Selecciona una especialidad</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            {selectedSpecialtyId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico <span className="text-red-500">*</span>
                </label>
                {loadingDoctors ? (
                  <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Cargando médicos...</span>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-700">
                      No hay médicos disponibles para esta especialidad en este momento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {doctors.map((doctor) => (
                      <label
                        key={doctor.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="doctor"
                          value={doctor.id}
                          checked={selectedDoctor?.id === doctor.id}
                          onChange={() => {
                            setSelectedDoctor(doctor);
                            setSelectedSlot(null);
                          }}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{doctor.name}</p>
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{doctor.hospital}</span>
                          </p>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
                          {doctor.availableSlots?.length || 0} turnos disponibles
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fecha y Hora */}
            {selectedDoctor && selectedDoctor.availableSlots && selectedDoctor.availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedDoctor.availableSlots.map((slot) => {
                    const { date, time } = formatDateTime(slot.startTime);
                    return (
                      <label
                        key={slot.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlot?.id === slot.id}
                          onChange={() => setSelectedSlot(slot)}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 capitalize">{date}</p>
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Datos del Paciente */}
            {selectedSlot && (
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {user ? 'Confirmar Datos' : 'Datos del Paciente'}
                </h3>

                {user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      ℹ️ Los datos de tu cuenta se usarán para este turno. Recibirás la confirmación por email.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                      required
                      disabled={loading || !!user}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+54 11 1234-5678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed"
                      required={!!user}
                      disabled={loading || !!user}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe aquí cualquier información adicional..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Reservando...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>Confirmar Reserva</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los turnos están sujetos a disponibilidad. Recibirás una
            confirmación por {user ? 'email' : 'SMS y/o email'} una vez procesada tu solicitud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSystemReal;
