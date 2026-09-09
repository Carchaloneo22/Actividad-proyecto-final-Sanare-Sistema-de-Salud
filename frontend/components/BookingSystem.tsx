import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Specialty, Doctor } from '../types';

const BookingSystem: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | ''>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock data - En producción esto vendría del backend
  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Juan Pérez',
      specialty: Specialty.GENERAL,
      hospital: 'Hospital Central',
      availableSlots: ['2025-11-25T09:00', '2025-11-25T10:00', '2025-11-26T14:00'],
    },
    {
      id: '2',
      name: 'Dra. María González',
      specialty: Specialty.CARDIOLOGY,
      hospital: 'Hospital San Juan',
      availableSlots: ['2025-11-25T11:00', '2025-11-27T09:00'],
    },
    {
      id: '3',
      name: 'Dr. Carlos Ramírez',
      specialty: Specialty.PEDIATRICS,
      hospital: 'Hospital Central',
      availableSlots: ['2025-11-25T15:00', '2025-11-26T10:00'],
    },
    {
      id: '4',
      name: 'Dra. Ana Martínez',
      specialty: Specialty.DERMATOLOGY,
      hospital: 'Centro de Salud Norte',
      availableSlots: ['2025-11-26T09:00', '2025-11-27T11:00'],
    },
  ];

  const filteredDoctors = selectedSpecialty
    ? mockDoctors.filter((doc) => doc.specialty === selectedSpecialty)
    : [];

  const selectedDoctorData = mockDoctors.find((doc) => doc.id === selectedDoctor);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !patientName || !patientPhone) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Aquí se haría la llamada al backend
    console.log('Reserva:', {
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date: selectedDate,
      patient: { name: patientName, phone: patientPhone, email: patientEmail },
    });

    setBookingSuccess(true);

    // Reset form después de 3 segundos
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSpecialty('');
      setSelectedDoctor('');
      setSelectedDate('');
      setPatientName('');
      setPatientPhone('');
      setPatientEmail('');
    }, 3000);
  };

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Reservar Turno</h2>
        </div>

        {bookingSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">¡Turno Confirmado!</h3>
            <p className="text-green-700">
              Recibirás un mensaje de confirmación en tu teléfono y email.
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
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value as Specialty);
                  setSelectedDoctor('');
                  setSelectedDate('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona una especialidad</option>
                {Object.values(Specialty).map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            {selectedSpecialty && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {filteredDoctors.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-700">
                        No hay médicos disponibles para esta especialidad en este momento.
                      </p>
                    </div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <label
                        key={doctor.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDoctor === doctor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="doctor"
                          value={doctor.id}
                          checked={selectedDoctor === doctor.id}
                          onChange={(e) => {
                            setSelectedDoctor(e.target.value);
                            setSelectedDate('');
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{doctor.name}</p>
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{doctor.hospital}</span>
                          </p>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
                          {doctor.availableSlots.length} turnos disponibles
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            {selectedDoctor && selectedDoctorData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedDoctorData.availableSlots.map((slot) => {
                    const { date, time } = formatDateTime(slot);
                    return (
                      <label
                        key={slot}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDate === slot
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="date"
                          value={slot}
                          checked={selectedDate === slot}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-4 h-4 text-blue-600"
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
            {selectedDate && (
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Paciente</h3>

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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Confirmar Reserva</span>
                </button>
              </div>
            )}
          </form>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los turnos están sujetos a disponibilidad. Recibirás una
            confirmación por SMS y/o email una vez procesada tu solicitud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
