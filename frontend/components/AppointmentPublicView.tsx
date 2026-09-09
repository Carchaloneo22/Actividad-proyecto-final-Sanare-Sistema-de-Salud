import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, AlertCircle, CheckCircle, Loader2, XCircle } from 'lucide-react';

interface AppointmentDetails {
  id: string;
  patientName: string;
  patientEmail: string | null;
  patientPhone: string;
  date: string;
  notes: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  doctor: {
    id: string;
    name: string;
    hospital: string;
    specialty: {
      name: string;
    };
  };
}

const AppointmentPublicView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    loadAppointment();

    // Check if user wants to cancel via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'cancel') {
      setShowCancelDialog(true);
    }
  }, [token]);

  const loadAppointment = async () => {
    if (!token) {
      setError('Token inválido');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/appointments-public/token/${token}`);
      if (!response.ok) {
        throw new Error('No se pudo cargar el turno');
      }
      const data = await response.json();
      setAppointment(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el turno');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!token) {
      return;
    }

    setShowCancelDialog(false);
    setCancelling(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/appointments-public/cancel/${token}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cancelar el turno');
      }

      setCancelled(true);
      // Recargar los detalles del turno
      await loadAppointment();
    } catch (err: any) {
      setError(err.message || 'Error al cancelar el turno');
    } finally {
      setCancelling(false);
    }
  };

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando turno...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Turno no encontrado'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { date: formattedDate, time: formattedTime } = formatDateTime(appointment.date);
  const appointmentDate = new Date(appointment.date);
  const isPast = appointmentDate < new Date();
  const canCancel = appointment.status !== 'CANCELLED' && !isPast;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && canCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Cancelar Turno</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cancelar este turno? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                No, mantener turno
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-6 ${
            appointment.status === 'CANCELLED' ? 'bg-red-500' :
            appointment.status === 'CONFIRMED' ? 'bg-green-500' :
            'bg-blue-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                {appointment.status === 'CANCELLED' ? (
                  <XCircle className="w-8 h-8" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    {appointment.status === 'CANCELLED' ? 'Turno Cancelado' : 'Turno Confirmado'}
                  </h1>
                  <p className="text-sm opacity-90">
                    ID: {appointment.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message after cancellation */}
          {cancelled && (
            <div className="mx-8 mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800">
                  Tu turno ha sido cancelado exitosamente. Recibirás un email de confirmación.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !cancelled && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Turno</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha y Hora</p>
                    <p className="text-lg text-gray-900 capitalize">{formattedDate}</p>
                    <p className="text-lg text-gray-900">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-lg text-gray-900">{appointment.doctor.name}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor.specialty.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hospital</p>
                    <p className="text-lg text-gray-900">{appointment.doctor.hospital}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Paciente</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p className="text-lg text-gray-900">{appointment.patientName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-lg text-gray-900">{appointment.patientPhone}</p>
                  </div>
                </div>

                {appointment.patientEmail && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg text-gray-900">{appointment.patientEmail}</p>
                    </div>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Notas</p>
                  <p className="text-gray-900">{appointment.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t pt-6 space-y-4">
              {canCancel && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  disabled={cancelling}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Cancelando...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Cancelar Turno</span>
                    </>
                  )}
                </button>
              )}

              {appointment.status === 'CANCELLED' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Este turno ha sido cancelado. Si necesitas un nuevo turno, por favor ingresa al sistema.
                  </p>
                </div>
              )}

              {isPast && appointment.status !== 'CANCELLED' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Este turno ya pasó.
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 SaludPública Connect</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPublicView;
