import React, { useState } from 'react';
import { useAppointments } from '../../contexts/AppointmentContext';
import { usePatients } from '../../contexts/PatientContext';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentForm from './AppointmentForm';
import AppointmentDetails from './AppointmentDetails';
import Modal from '../common/Modal';
import { dateUtils } from '../../utils/dateUtils';
import { Search } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AppointmentList = () => {
  const { appointments, updateAppointment, deleteAppointment, loading } = useAppointments();
  const { patients } = usePatients();
  const { currentUser, isAdmin } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });

  const filteredAppointments = appointments
    .filter(appointment => {
      if (!isAdmin()) {
        return appointment.patientId === currentUser.patientId;
      }
      return true;
    })
    .filter(appointment => {
      if (!searchQuery) return true;
      const patient = patients.find(p => p.id === appointment.patientId);
      const searchLower = searchQuery.toLowerCase();
      return (
        patient?.name.toLowerCase().includes(searchLower) ||
        appointment.title.toLowerCase().includes(searchLower) ||
        appointment.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    setActionLoading({ id: appointmentId, type: 'status' });
    await new Promise(resolve => setTimeout(resolve, 500));
    updateAppointment(appointmentId, { status: newStatus });
    setActionLoading({ id: null, type: null });
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setActionLoading({ id: appointmentId, type: 'delete' });
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteAppointment(appointmentId);
      setActionLoading({ id: null, type: null });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(false);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true);
  };

  const handleModalClose = () => {
    setSelectedAppointment(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search appointments..."
          className="form-input pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  {isAdmin() && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const isActionLoading = actionLoading.id === appointment.id;
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {dateUtils.formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dateUtils.formatTime(appointment.appointmentDate)}
                        </div>
                      </td>
                      {isAdmin() && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patient?.name}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="text-left hover:text-primary-600"
                        >
                          <div className="text-sm text-gray-900">{appointment.title}</div>
                          <div className="text-sm text-gray-500">{appointment.description}</div>
                          {(appointment.treatmentNotes || appointment.attachments?.length > 0 || appointment.nextAppointmentDate) && (
                            <div className="text-xs text-primary-600 mt-1">
                              {[
                                appointment.treatmentNotes && 'Notes',
                                appointment.attachments?.length > 0 && `${appointment.attachments.length} Files`,
                                appointment.nextAppointmentDate && 'Next Appointment'
                              ].filter(Boolean).join(' • ')}
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {isActionLoading ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(appointment)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Edit
                              </button>
                              {appointment.status === 'Scheduled' && (
                                <button
                                  onClick={() => handleUpdateStatus(appointment.id, 'Completed')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAppointments.length === 0 && (
              <p className="text-center text-gray-500 py-4">No appointments found</p>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={!!selectedAppointment}
        onClose={handleModalClose}
        title={isEditing ? "Edit Appointment" : "Appointment Details"}
      >
        {selectedAppointment && (
          isEditing ? (
            <AppointmentForm
              appointment={selectedAppointment}
              onSubmit={async (data) => {
                setActionLoading({ id: selectedAppointment.id, type: 'edit' });
                await new Promise(resolve => setTimeout(resolve, 500));
                updateAppointment(selectedAppointment.id, data);
                setActionLoading({ id: null, type: null });
                handleModalClose();
              }}
              onCancel={handleModalClose}
            />
          ) : (
            <AppointmentDetails
              appointment={selectedAppointment}
              onClose={handleModalClose}
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default AppointmentList; 