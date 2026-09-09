import React, { useState, useEffect } from 'react';
import { Doctor, AppointmentWithDetails } from '../types/doctor';
import { appointmentService } from '../services/appointmentService';
import {
  X, User, Mail, Phone, Building, Stethoscope, Calendar,
  ChevronLeft, ChevronRight, Clock
} from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function DoctorDetailModal({ doctor, onClose }: DoctorDetailModalProps) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllAppointments();
  }, [doctor.id]);

  const loadAllAppointments = async () => {
    try {
      setLoading(true);
      const allAppointments = await appointmentService.getAll();
      // Filtrar solo los turnos de este doctor
      const doctorAppointments = allAppointments.filter(
        (apt) => apt.doctorId === doctor.id
      );
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date): AppointmentWithDetails[] => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= startOfDay && aptDate <= endOfDay;
    });
  };

  const getAppointmentsForMonth = (date: Date): Map<number, number> => {
    const appointmentsByDay = new Map<number, number>();

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.date);
      if (
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      ) {
        const day = aptDate.getDate();
        appointmentsByDay.set(day, (appointmentsByDay.get(day) || 0) + 1);
      }
    });

    return appointmentsByDay;
  };

  // Calendar helper functions
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }

    return days;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (day: number | null) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const selectDay = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelado';
      case 'COMPLETED':
        return 'Completado';
      default:
        return status;
    }
  };

  const dayAppointments = getAppointmentsForDate(selectedDate);
  const monthAppointments = getAppointmentsForMonth(currentMonth);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
            <p className="text-gray-600 mt-1">Información y calendario completo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Doctor Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Especialidad</p>
                    <p className="font-medium text-gray-900">{doctor.specialty?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Hospital</p>
                    <p className="font-medium text-gray-900">{doctor.hospital}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{doctor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">{doctor.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Turnos</p>
                    <p className="font-medium text-gray-900">{appointments.length} turnos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Appointments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const appointmentCount = day ? monthAppointments.get(day) || 0 : 0;
                  return (
                    <button
                      key={index}
                      onClick={() => day && selectDay(day)}
                      disabled={!day}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors
                        ${!day ? 'invisible' : ''}
                        ${isToday(day) ? 'bg-blue-100 text-blue-900 font-bold' : ''}
                        ${isSelectedDate(day) ? 'bg-blue-600 text-white font-bold' : ''}
                        ${!isToday(day) && !isSelectedDate(day) ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      <span>{day}</span>
                      {appointmentCount > 0 && (
                        <span className={`
                          text-xs mt-0.5
                          ${isSelectedDate(day) ? 'text-blue-200' : 'text-blue-600'}
                        `}>
                          {appointmentCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Appointments */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Turnos del {selectedDate.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </h3>
                <span className="text-sm text-gray-500">
                  {dayAppointments.length} {dayAppointments.length === 1 ? 'turno' : 'turnos'}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : dayAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay turnos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este doctor no tiene turnos agendados para este día.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {dayAppointments
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600 mb-1" />
                            <span className="text-xs font-semibold text-blue-900">
                              {formatTime(appointment.date)}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {appointment.patientName}
                                </p>
                                <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
                                {appointment.patientEmail && (
                                  <p className="text-sm text-gray-600">{appointment.patientEmail}</p>
                                )}
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                              >
                                {getStatusText(appointment.status)}
                              </span>
                            </div>

                            {appointment.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                <span className="font-medium">Notas:</span> {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
