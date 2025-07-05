import React, { useEffect } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import KPICard from './KPICard';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { patients } = usePatients();
  const { appointments, getUpcomingAppointments, getTodayAppointments } = useAppointments();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current patients in AdminDashboard:', patients);
  }, [patients]);

  // Calculate KPIs
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + (appointment.cost || 0), 0);

  const kpis = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Completed Treatments',
      value: completedAppointments.length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening at your dental center today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              upcomingAppointments.slice(0, 5).map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{patient?.name}</p>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {dateUtils.formatDate(appointment.appointmentDate, 'dd MMM')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dateUtils.formatTime(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {patients && patients.length > 0 ? (
              patients
                .filter(patient => patient && patient.name && patient.email) // Only show patients with required data
                .slice(-5)
                .reverse()
                .map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{patient.email || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{patient.contact || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {patient.createdAt ? dateUtils.formatDate(patient.createdAt) : 'N/A'}
                      </p>
                      <button
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No patients registered</p>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Status Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Scheduled', 'Completed', 'Cancelled'].map((status) => {
            const count = appointments.filter(a => a.status === status).length;
            const percentage = totalAppointments > 0 ? (count / totalAppointments * 100).toFixed(1) : 0;
            
            return (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;