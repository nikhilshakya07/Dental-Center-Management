import React, { useState, useEffect } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PatientForm = ({ patient = null, onSubmit, onCancel }) => {
  const { addPatient, updatePatient } = usePatients();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    contact: '',
    address: '',
    healthInfo: '',
    emergencyContact: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        dob: patient.dob || '',
        contact: patient.contact || '',
        address: patient.address || '',
        healthInfo: patient.healthInfo || '',
        emergencyContact: patient.emergencyContact || ''
      });
    }
  }, [patient]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    if (formData.contact.length < 10) newErrors.contact = 'Valid contact number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const trimmedData = Object.entries(formData).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? value.trim() : value
    }), {});
    
    setLoading(true);
    try {
      if (patient) {
        await updatePatient(patient.id, trimmedData);
      } else {
        await addPatient(trimmedData);
      }
      onSubmit && onSubmit();
    } catch (error) {
      console.error('Error saving patient:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save patient. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${errors.name ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={`form-input ${errors.dob ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          Contact Number *
        </label>
        <input
          type="tel"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className={`form-input ${errors.contact ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={formData.address}
          onChange={handleChange}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
          Emergency Contact
        </label>
        <input
          type="text"
          id="emergencyContact"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="healthInfo" className="block text-sm font-medium text-gray-700">
          Health Information & Allergies
        </label>
        <textarea
          id="healthInfo"
          name="healthInfo"
          rows={3}
          value={formData.healthInfo}
          onChange={handleChange}
          placeholder="Any allergies, medical conditions, or special notes..."
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
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
          disabled={loading}
          className="btn-primary flex items-center justify-center min-w-[100px]"
        >
          {loading ? (
            <LoadingSpinner size="small" className="mr-2" />
          ) : (
            patient ? 'Update Patient' : 'Add Patient'
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;