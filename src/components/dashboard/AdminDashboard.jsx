import React, { useEffect, useMemo } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import KPICard from './KPICard';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award
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

  
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const pendingAppointments = appointments.filter(a => a.status === 'Scheduled');
  const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + (appointment.cost || 0), 0);


  const topPatients = useMemo(() => {
    const patientStats = patients.map(patient => {
      const patientAppointments = appointments.filter(a => a.patientId === patient.id);
      const totalSpent = patientAppointments.reduce((sum, app) => sum + (app.cost || 0), 0);
      const visitCount = patientAppointments.length;
      
      return {
        ...patient,
        totalSpent,
        visitCount
      };
    });

    return patientStats
      .sort((a, b) => b.totalSpent - a.totalSpent || b.visitCount - a.visitCount)
      .slice(0, 5);
  }, [patients, appointments]);

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
      title: 'Pending Treatments',
      value: pendingAppointments.length,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      title: 'Completed Treatments',
      value: completedAppointments.length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Next Appointments</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments
                .slice(0, 10)  
                .map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} 
                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{patient?.name}</p>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                      <p className="text-xs text-gray-500">{appointment.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {dateUtils.formatDate(appointment.appointmentDate, 'dd MMM')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dateUtils.formatTime(appointment.appointmentDate)}
                      </p>
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Patients</h3>
          <div className="space-y-3">
            {topPatients.length > 0 ? (
              topPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <p className="font-medium text-gray-900">{patient.name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{patient.visitCount} visits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${patient.totalSpent.toLocaleString()}
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
              <p className="text-gray-500 text-center py-4">No patient data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Scheduled', 'Completed', 'Cancelled'].map((status) => {
            const count = appointments.filter(a => a.status === status).length;
            const percentage = totalAppointments > 0 ? (count / totalAppointments * 100).toFixed(1) : 0;
            const totalValue = appointments
              .filter(a => a.status === status)
              .reduce((sum, a) => sum + (a.cost || 0), 0);
            
            return (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-xs text-gray-500">{percentage}% of total</p>
                <p className="text-sm font-medium text-gray-700 mt-2">${totalValue.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;