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
    try {
      const newAppointment = {
        ...appointmentData,
        id: localStorageService.generateId(),
        createdAt: new Date().toISOString(),
        status: appointmentData.status || 'Scheduled',
        attachments: appointmentData.attachments || []
      };

      if (appointmentData.previousAppointmentId) {
        newAppointment.previousAppointmentId = appointmentData.previousAppointmentId;
      }
      
      const updatedAppointments = [...appointments, newAppointment];
      const success = localStorageService.setAppointments(updatedAppointments);
      
      if (!success) {
        throw new Error('Failed to save appointment to storage');
      }
      
      setAppointments(updatedAppointments);
      return newAppointment;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw new Error('Failed to create appointment. Please try again.');
    }
  };

  const updateAppointment = async (id, appointmentData) => {
    try {
      if (appointmentData.nextAppointmentDate && !appointmentData.nextAppointmentCreated) {
        const nextAppointment = {
          patientId: appointmentData.patientId,
          title: appointmentData.nextAppointmentNotes ? appointmentData.nextAppointmentNotes : 'Follow-up Appointment',
          description: `Follow-up appointment for: ${appointmentData.title}`,
          appointmentDate: appointmentData.nextAppointmentDate,
          status: 'Scheduled',
          previousAppointmentId: id
        };
        
        await addAppointment(nextAppointment);
        appointmentData.nextAppointmentCreated = true;
      }

      const updatedAppointments = appointments.map(appointment =>
        appointment.id === id ? { ...appointment, ...appointmentData } : appointment
      );
      
      const success = localStorageService.setAppointments(updatedAppointments);
      
      if (!success) {
        throw new Error('Failed to save updated appointment to storage');
      }
      
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment. Please try again.');
    }
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

  const downloadFile = (fileData) => {
    try {
      const [mimeTypeHeader, base64Data] = fileData.data.split(',');
      const mimeType = mimeTypeHeader.split(':')[1].split(';')[0];
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
    }
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
    downloadFile,
    refreshAppointments: loadAppointments
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};