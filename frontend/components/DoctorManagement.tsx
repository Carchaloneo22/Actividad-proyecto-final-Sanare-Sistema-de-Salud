import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { Doctor, CreateDoctorData, Specialty } from '../types/doctor';
import { Plus, Edit, Trash2, X, UserPlus, Mail, Phone, Building, Stethoscope } from 'lucide-react';
import DoctorDetailModal from './DoctorDetailModal';

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateDoctorData>({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    specialtyId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doctorsData, specialtiesData] = await Promise.all([
        doctorService.getAll(),
        doctorService.getSpecialties(),
      ]);
      setDoctors(doctorsData);
      setSpecialties(specialtiesData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingDoctor) {
        await doctorService.update(editingDoctor.id, formData);
      } else {
        await doctorService.create(formData);
      }

      await loadData();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este doctor?')) return;

    try {
      await doctorService.delete(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const openModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        hospital: doctor.hospital,
        specialtyId: doctor.specialtyId,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        hospital: '',
        specialtyId: '',
      });
    }
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Doctores</h2>
          <p className="text-gray-600 mt-1">Administrar doctores del sistema</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Doctor
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Doctors List - Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hospital
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setViewingDoctor(doctor)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                  >
                    {doctor.name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {doctor.specialty?.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.hospital}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{doctor.email}</div>
                  <div className="text-sm text-gray-500">{doctor.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor._count?.appointments || 0} turnos
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openModal(doctor)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Editar doctor"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar doctor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {doctors.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay doctores</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo doctor.</p>
          </div>
        )}
      </div>

      {/* Doctors List - Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {doctors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay doctores</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo doctor.</p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <button
                  onClick={() => setViewingDoctor(doctor)}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline text-left"
                >
                  {doctor.name}
                </button>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {doctor.specialty?.name}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                  <span>{doctor._count?.appointments || 0} turnos</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openModal(doctor)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="font-medium">Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Eliminar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. Juan Pérez"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="doctor@hospital.com"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                {/* Hospital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hospital Central"
                    />
                  </div>
                </div>

                {/* Especialidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidad *
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.specialtyId}
                      onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Seleccionar especialidad</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingDoctor ? 'Actualizar' : 'Crear'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Detail Modal */}
      {viewingDoctor && (
        <DoctorDetailModal
          doctor={viewingDoctor}
          onClose={() => setViewingDoctor(null)}
        />
      )}
    </div>
  );
}
