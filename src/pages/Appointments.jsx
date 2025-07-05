import React, { useState } from 'react';
import AppointmentList from '../components/appointment/AppointmentList';
import AppointmentForm from '../components/appointment/AppointmentForm';
import Modal from '../components/common/Modal';
import { useAppointments } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { addAppointment } = useAppointments();
  const { isAdmin } = useAuth();

  const handleAddAppointment = async (appointmentData) => {
    await addAppointment(appointmentData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin() ? 'All Appointments' : 'My Appointments'}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Schedule Appointment
        </button>
      </div>

      <AppointmentList />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Appointment"
      >
        <AppointmentForm
          onSubmit={handleAddAppointment}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Appointments; 