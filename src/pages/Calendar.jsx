import React, { useState } from 'react';
import { format, parseISO, setHours, setMinutes } from 'date-fns';
import { useAppointments } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import AppointmentCalendar from '../components/appointment/AppointmentCalendar';
import AppointmentForm from '../components/appointment/AppointmentForm';
import AppointmentDetails from '../components/appointment/AppointmentDetails';
import Modal from '../components/common/Modal';

const Calendar = () => {
  const { appointments, addAppointment, updateAppointment, loading } = useAppointments();
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isNewAppointment, setIsNewAppointment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDayClick = (date, dayAppointments) => {
    setSelectedDate(date);
    setSelectedAppointments(dayAppointments);
    setShowAppointmentModal(true);
    setSelectedAppointment(null);
    setIsNewAppointment(false);
    setIsEditing(false);
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    if (isNewAppointment) {
      await addAppointment(appointmentData);
    } else {
      await updateAppointment(selectedAppointment.id, appointmentData);
    }
    handleModalClose();
  };

  const handleNewAppointment = () => {
    
    const defaultTime = setHours(setMinutes(selectedDate, 0), 9);
    setSelectedAppointment({
      appointmentDate: defaultTime.toISOString(),
      status: 'Scheduled'
    });
    setIsNewAppointment(true);
    setIsEditing(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsNewAppointment(false);
    setIsEditing(true);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsNewAppointment(false);
    setIsEditing(false);
  };

  const handleModalClose = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
    setIsNewAppointment(false);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">View and manage appointments</p>
      </div>

      <AppointmentCalendar
        appointments={appointments}
        onDayClick={handleDayClick}
        loading={loading}
      />

      
      <Modal
        isOpen={showAppointmentModal}
        onClose={handleModalClose}
        title={
          isNewAppointment
            ? 'New Appointment'
            : selectedAppointment
            ? isEditing
              ? 'Edit Appointment'
              : 'Appointment Details'
            : selectedDate
            ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}`
            : 'Appointments'
        }
      >
        {isNewAppointment || (selectedAppointment && isEditing) ? (
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleAppointmentSubmit}
            onCancel={handleModalClose}
          />
        ) : selectedAppointment ? (
          <AppointmentDetails
            appointment={selectedAppointment}
            onClose={handleModalClose}
          />
        ) : (
          <div className="space-y-4">
            {selectedAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="flex-grow text-left"
                      >
                        <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(appointment.appointmentDate), 'h:mm a')}
                        </p>
                        {appointment.description && (
                          <p className="mt-2 text-gray-700">{appointment.description}</p>
                        )}
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
                      {isAdmin() && (
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-800 ml-4"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No appointments scheduled for this day.</p>
            )}
            {isAdmin() && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNewAppointment}
                  className="btn-primary"
                >
                  New Appointment
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendar; 