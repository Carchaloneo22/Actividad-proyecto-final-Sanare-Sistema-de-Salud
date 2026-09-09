import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TriageChat from './components/TriageChat';
import AppointmentScheduler from './components/AppointmentScheduler';
import AdminDashboard from './components/AdminDashboard';
import AppointmentPublicView from './components/AppointmentPublicView';
import Login from './components/Login';
import Register from './components/Register';
import { Stethoscope, CalendarCheck, ArrowRight } from 'lucide-react';
import { UserRole } from './types/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const HomePage: React.FC = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Gestión de Turnos <br/>
          <span className="text-blue-600">Rápida, Justa y Eficiente</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          El nuevo sistema unificado para centros de salud públicos.
          Agendá tu turno, recibí notificaciones cuando se liberen espacios y obtené orientación médica inmediata con IA.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/booking"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-bold text-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" />
            Ya sé qué necesito
          </Link>
          <Link
            to="/triage"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-5 h-5" />
            Ayúdenme a elegir
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
            <CalendarCheck />
          </div>
          <h3 className="font-bold text-lg mb-2">Reserva Instantánea</h3>
          <p className="text-slate-600 text-sm">Accedé a la disponibilidad real de todos los centros de salud de la red. Sin llamadas interminables.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
            <Stethoscope />
          </div>
          <h3 className="font-bold text-lg mb-2">Triaje Inteligente (Gemini)</h3>
          <p className="text-slate-600 text-sm">¿No estás seguro de qué especialista ver? Nuestra IA analiza tus síntomas y te deriva correctamente.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <CalendarCheck />
            </div>
          </div>
          <h3 className="font-bold text-lg mb-2">Lista de Espera Activa</h3>
          <p className="text-slate-600 text-sm">Si no hay lugar, suscribite. Cuando alguien cancela, te avisamos automáticamente (Microservicio Bull+Redis).</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment/:token" element={<AppointmentPublicView />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <HomePage />
              </main>
            </PrivateRoute>
          }
        />

        <Route
          path="/triage"
          element={
            <PrivateRoute>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 py-10">
                <Link
                  to="/"
                  className="mb-6 text-slate-500 hover:text-blue-600 flex items-center gap-2"
                >
                  ← Volver
                </Link>
                <TriageChat />
              </main>
            </PrivateRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <PrivateRoute allowedRoles={[UserRole.PATIENT]}>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <AppointmentScheduler />
              </main>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <AdminDashboard />
              </main>
            </PrivateRoute>
          }
        />
      </Routes>

      {isAuthenticated && (
        <footer className="bg-slate-900 text-slate-400 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2025 Sistema Público de Gestión de Turnos. Todos los derechos reservados.</p>
            <p className="text-xs mt-2">Powered by React, NestJS, PostgreSQL, Redis & Google Gemini</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;