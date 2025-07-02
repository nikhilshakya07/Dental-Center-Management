import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService } from '../utils/localStorage';

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setLoading(true);
    const appointmentsData = localStorageService.getAppointments();
    setAppointments(appointmentsData);
    setLoading(false);
  };

  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: localStorageService.generateId(),
      createdAt: new Date().toISOString(),
      status: 'Scheduled',
      files: []
    };
    
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorageService.setAppointments(updatedAppointments);
    return newAppointment;
  };

  const updateAppointment = (id, appointmentData) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    );
    setAppointments(updatedAppointments);
    localStorageService.setAppointments(updatedAppointments);
  };

  const deleteAppointment = (id) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments);
    localStorageService.setAppointments(updatedAppointments);
  };

  const getAppointmentById = (id) => {
    return appointments.find(appointment => appointment.id === id);
  };

  const getAppointmentsByPatient = (patientId) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getUpcomingAppointments = (limit = 10) => {
    const now = new Date();
    return appointments
      .filter(appointment => new Date(appointment.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => 
      appointment.appointmentDate.startsWith(today)
    );
  };

  const getAppointmentsByDateRange = (startDate, endDate) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  };

  const addFileToAppointment = (appointmentId, fileData) => {
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          files: [...(appointment.files || []), fileData]
        };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
    localStorageService.setAppointments(updatedAppointments);
  };

  const value = {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsByPatient,
    getUpcomingAppointments,
    getTodayAppointments,
    getAppointmentsByDateRange,
    addFileToAppointment,
    refreshAppointments: loadAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};