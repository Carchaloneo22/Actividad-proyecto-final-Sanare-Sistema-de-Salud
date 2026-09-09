import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, TrendingUp, UserCog, CalendarCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import DoctorManagement from './DoctorManagement';
import AppointmentsCalendar from './AppointmentsCalendar';

type TabType = 'overview' | 'doctors' | 'calendar';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/appointments/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data para gráficos (en producción vendrían del backend)
  const appointmentsBySpecialty = [
    { specialty: 'General', count: 25 },
    { specialty: 'Cardiología', count: 18 },
    { specialty: 'Pediatría', count: 32 },
    { specialty: 'Dermatología', count: 15 },
    { specialty: 'Traumatología', count: 12 },
  ];

  const appointmentsByDay = [
    { day: 'Lun', count: 45 },
    { day: 'Mar', count: 52 },
    { day: 'Mié', count: 48 },
    { day: 'Jue', count: 61 },
    { day: 'Vie', count: 55 },
    { day: 'Sáb', count: 28 },
    { day: 'Dom', count: 15 },
  ];

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Resumen',
      icon: TrendingUp,
    },
    {
      id: 'doctors' as TabType,
      label: 'Gestión de Doctores',
      icon: UserCog,
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendario',
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Turnos</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stats.total}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {loading ? '...' : stats.confirmed}
                  </p>
                </div>
                <Activity className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {loading ? '...' : stats.pending}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelados</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {loading ? '...' : stats.cancelled}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments by Specialty */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Turnos por Especialidad</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentsBySpecialty}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="specialty" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" name="Turnos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Appointments by Day */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Turnos por Día de la Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} name="Turnos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('doctors')}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <UserCog className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Doctores</p>
                  <p className="text-sm text-gray-600">Agregar o editar doctores</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <CalendarCheck className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Ver Calendario</p>
                  <p className="text-sm text-gray-600">Gestionar turnos diarios</p>
                </div>
              </button>

              <button
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <Activity className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Reportes</p>
                  <p className="text-sm text-gray-600">Generar estadísticas</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && <DoctorManagement />}
      {activeTab === 'calendar' && <AppointmentsCalendar />}
    </div>
  );
};

export default AdminDashboard;
