import React, { useState } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import PatientForm from './PatientForm';
import { dateUtils } from '../../utils/dateUtils';

const PatientDetails = ({ patient, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updatePatient, deletePatient } = usePatients();
  const { appointments, deleteAppointment } = useAppointments();

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === patient.id
  );

  const handleUpdatePatient = async (updatedData) => {
    await updatePatient(patient.id, updatedData);
    setIsEditing(false);
  };

  const handleDeletePatient = async () => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      // Delete all appointments for this patient
      patientAppointments.forEach(appointment => {
        deleteAppointment(appointment.id);
      });
      
      await deletePatient(patient.id);
      onClose();
    }
  };

  if (isEditing) {
    return (
      <PatientForm
        patient={patient}
        onSubmit={handleUpdatePatient}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
            <p className="text-sm text-gray-500">Personal and contact details</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePatient}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1">{patient.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{patient.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
            <p className="mt-1">{dateUtils.formatDate(patient.dob)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contact</label>
            <p className="mt-1">{patient.contact}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="mt-1">{patient.address}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">Health Information</label>
            <p className="mt-1">{patient.healthInfo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
            <p className="mt-1">{patient.emergencyContact}</p>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Appointment History</h3>
        <div className="space-y-2">
          {patientAppointments.length > 0 ? (
            patientAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 bg-gray-50 rounded-lg space-y-2"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    appointment.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{appointment.description}</p>
                <div className="text-sm text-gray-500">
                  {dateUtils.formatDate(appointment.appointmentDate)} at {dateUtils.formatTime(appointment.appointmentDate)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No appointment history</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails; 