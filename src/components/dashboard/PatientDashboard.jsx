import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { usePatients } from '../../contexts/PatientContext';
import KPICard from './KPICard';
import { Calendar, FileText, Clock, DollarSign } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const { getAppointmentsByPatient } = useAppointments();
  const { getPatientById } = usePatients();

  const patientData = getPatientById(currentUser.patientId);
  const patientAppointments = getAppointmentsByPatient(currentUser.patientId);
  
  const upcomingAppointments = patientAppointments.filter(
    appointment => dateUtils.isFuture(appointment.appointmentDate)
  );
  const completedAppointments = patientAppointments.filter(
    appointment => appointment.status === 'Completed'
  );
  const totalSpent = completedAppointments.reduce((sum, appointment) => sum + (appointment.cost || 0), 0);

  const kpis = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Completed Treatments',
      value: completedAppointments.length,
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Total Spent',
      value: `${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {patientData?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your dental appointments and treatments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{appointment.title}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{dateUtils.formatDate(appointment.appointmentDate)}</span>
                    <span>{dateUtils.formatTime(appointment.appointmentDate)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Recent Treatment History */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Treatment History</h3>
          <div className="space-y-3">
            {completedAppointments.length > 0 ? (
              completedAppointments.slice(-3).reverse().map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{appointment.title}</p>
                    <span className="text-sm font-medium text-green-600">
                      ${appointment.cost}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{appointment.treatment}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{dateUtils.formatDate(appointment.appointmentDate)}</span>
                    {appointment.files?.length > 0 && (
                      <span>{appointment.files.length} file(s)</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No treatment history</p>
            )}
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        {patientData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{patientData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{patientData.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-gray-900">{dateUtils.formatDate(patientData.dob)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
              <p className="text-gray-900">{patientData.emergencyContact}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Health Information</p>
              <p className="text-gray-900">{patientData.healthInfo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;