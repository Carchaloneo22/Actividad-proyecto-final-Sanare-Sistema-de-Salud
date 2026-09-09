import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Calendar, Users, Home, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home, roles: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN] },
    { path: '/triage', label: 'Triaje IA', icon: Activity, roles: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN] },
    { path: '/booking', label: 'Reservar Turno', icon: Calendar, roles: [UserRole.PATIENT] },
    { path: '/admin', label: 'Administración', icon: Users, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8" />
            <span className="font-bold text-xl">SaludPública Connect</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-700'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="border-l border-blue-400 h-8"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-200">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Activity className="w-7 h-7" />
              <span className="font-bold text-lg">SaludPública</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="pb-4 space-y-2">
              {/* User Info */}
              <div className="bg-blue-700 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-200">{user?.role}</p>
              </div>

              {/* Navigation Items */}
              {filteredNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'bg-blue-700 hover:bg-blue-600'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
