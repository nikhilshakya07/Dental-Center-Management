import React from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { dateUtils } from '../../utils/dateUtils';
import { FileText, Calendar, DollarSign } from 'lucide-react';

const AppointmentDetails = ({ appointment, onClose }) => {
  const { patients } = usePatients();
  const { downloadFile } = useAppointments();
  const patient = patients.find(p => p.id === appointment.patientId);

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

  const handleDownload = (file) => {
    if (!downloadFile(file)) {
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{appointment.title}</h2>
          <p className="text-gray-600">{patient?.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="mt-1 text-gray-900">
              {dateUtils.formatDate(appointment.appointmentDate)} at {dateUtils.formatTime(appointment.appointmentDate)}
            </p>
          </div>

          {appointment.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900">{appointment.description}</p>
            </div>
          )}

          {appointment.cost > 0 && (
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cost</h3>
                <p className="mt-1 text-gray-900">${appointment.cost}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {appointment.treatmentNotes && (
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Treatment Notes</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{appointment.treatmentNotes}</p>
              </div>
            </div>
          )}

          {appointment.nextAppointmentDate && (
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Next Appointment</h3>
                <p className="mt-1 text-gray-900">
                  {dateUtils.formatDate(appointment.nextAppointmentDate)}
                </p>
                {appointment.nextAppointmentNotes && (
                  <p className="mt-1 text-gray-600 text-sm">{appointment.nextAppointmentNotes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      
      {appointment.attachments && appointment.attachments.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Files</h3>
          <div className="space-y-2">
            {appointment.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      
      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails; 