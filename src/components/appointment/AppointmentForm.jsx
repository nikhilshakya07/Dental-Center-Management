import React, { useState, useEffect } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useAuth } from '../../contexts/AuthContext';
import { dateUtils } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import FileUpload from '../common/FileUpload';

const AppointmentForm = ({ appointment = null, onSubmit, onCancel, loading = false }) => {
  const { patients } = usePatients();
  const { currentUser, isAdmin } = useAuth();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'Scheduled',
    cost: '',
    treatmentNotes: '',
    nextAppointmentDate: '',
    nextAppointmentNotes: '',
    attachments: []
  });

  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.appointmentDate);
      const nextDate = appointment.nextAppointmentDate ? new Date(appointment.nextAppointmentDate) : '';
      setFormData({
        patientId: appointment.patientId || '',
        title: appointment.title || '',
        description: appointment.description || '',
        appointmentDate: dateUtils.formatDateForInput(date),
        appointmentTime: dateUtils.formatTimeForInput(date),
        status: appointment.status || 'Scheduled',
        cost: appointment.cost || '',
        treatmentNotes: appointment.treatmentNotes || '',
        nextAppointmentDate: nextDate ? dateUtils.formatDateForInput(nextDate) : '',
        nextAppointmentNotes: appointment.nextAppointmentNotes || '',
        attachments: appointment.attachments || []
      });
    } else if (!isAdmin()) {
      setFormData(prev => ({
        ...prev,
        patientId: currentUser.patientId
      }));
    }
  }, [appointment, currentUser, isAdmin]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';
    
    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
      const now = new Date();
      now.setSeconds(0, 0);
      
      if (isNaN(appointmentDateTime.getTime())) {
        newErrors.appointmentDate = 'Invalid date/time format';
      } else if (appointmentDateTime < now) {
        newErrors.appointmentDate = 'Appointment cannot be in the past';
      }

      if (formData.nextAppointmentDate) {
        const nextAppointmentDate = new Date(formData.nextAppointmentDate);
        if (isNaN(nextAppointmentDate.getTime())) {
          newErrors.nextAppointmentDate = 'Invalid next appointment date';
        } else if (nextAppointmentDate <= appointmentDateTime) {
          newErrors.nextAppointmentDate = 'Next appointment must be after current appointment';
        }
      }
    } catch (error) {
      console.error('Date validation error:', error);
      newErrors.appointmentDate = 'Invalid date format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error('Invalid appointment date/time');
      }
      
      const submissionData = {
        patientId: formData.patientId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        appointmentDate: appointmentDateTime.toISOString(),
        status: formData.status,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        treatmentNotes: formData.treatmentNotes.trim(),
        nextAppointmentDate: formData.nextAppointmentDate ? new Date(formData.nextAppointmentDate).toISOString() : null,
        nextAppointmentNotes: formData.nextAppointmentNotes.trim(),
        attachments: formData.attachments
      };

      onSubmit(submissionData);
    } catch (error) {
      console.error('Error preparing appointment data:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create appointment. Please check all fields and try again.'
      }));
    }
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, file]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isAdmin() && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient</label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="form-input mt-1"
            disabled={loading}
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="form-input mt-1"
          placeholder="e.g., Regular Checkup"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-input mt-1"
          rows={3}
          placeholder="Add any relevant details..."
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            className="form-input mt-1"
            disabled={loading}
          />
          {errors.appointmentDate && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={formData.appointmentTime}
            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            className="form-input mt-1"
            disabled={loading}
          />
          {errors.appointmentTime && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
          )}
        </div>
      </div>

      {isAdmin() && appointment && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-input mt-1"
                disabled={loading}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="form-input mt-1"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Treatment Notes</label>
            <textarea
              value={formData.treatmentNotes}
              onChange={(e) => setFormData({ ...formData, treatmentNotes: e.target.value })}
              className="form-input mt-1"
              rows={4}
              placeholder="Enter detailed treatment notes..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Next Appointment Date</label>
              <input
                type="date"
                value={formData.nextAppointmentDate}
                onChange={(e) => setFormData({ ...formData, nextAppointmentDate: e.target.value })}
                className="form-input mt-1"
                disabled={loading}
                min={formData.appointmentDate}
              />
              {errors.nextAppointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.nextAppointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Next Appointment Notes</label>
              <textarea
                value={formData.nextAppointmentNotes}
                onChange={(e) => setFormData({ ...formData, nextAppointmentNotes: e.target.value })}
                className="form-input mt-1"
                rows={2}
                placeholder="Add notes for next appointment..."
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
            <FileUpload
              onFileSelect={handleFileSelect}
              maxSize={5}
              acceptedTypes={['image/*', 'application/pdf']}
              disabled={loading}
            />
            
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Uploaded Files</label>
                <ul className="divide-y divide-gray-200">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center justify-center min-w-[120px]"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            `${appointment ? 'Update' : 'Schedule'} Appointment`
          )}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm; 