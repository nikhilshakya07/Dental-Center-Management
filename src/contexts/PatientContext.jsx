import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService } from '../utils/localStorage';

const PatientContext = createContext();

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setLoading(true);
    const patientsData = localStorageService.getPatients();
    console.log('Loading patients from localStorage:', patientsData);
    setPatients(patientsData);
    setLoading(false);
  };

  const addPatient = (patientData) => {
    if (!patientData) {
      console.error('Attempted to add patient with no data');
      return null;
    }

    console.log('Adding new patient:', patientData);
    const newPatient = {
      ...patientData,
      id: localStorageService.generateId(),
      createdAt: new Date().toISOString()
    };
    
    const updatedPatients = [...patients, newPatient];
    console.log('Saving updated patients to localStorage:', updatedPatients);
    setPatients(updatedPatients);
    localStorageService.setPatients(updatedPatients);
    return newPatient;
  };

  const updatePatient = (id, patientData) => {
    if (!id || !patientData) {
      console.error('Invalid update parameters:', { id, patientData });
      return;
    }

    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...patientData } : patient
    );
    setPatients(updatedPatients);
    localStorageService.setPatients(updatedPatients);
  };

  const deletePatient = (id) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    setPatients(updatedPatients);
    localStorageService.setPatients(updatedPatients);
  };

  const getPatientById = (id) => {
    return patients.find(patient => patient.id === id);
  };

  const searchPatients = (query) => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.contact.includes(query)
    );
  };

  const value = {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    searchPatients,
    refreshPatients: loadPatients
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};