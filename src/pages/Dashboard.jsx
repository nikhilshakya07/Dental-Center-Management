import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return isAdmin() ? <AdminDashboard /> : <PatientDashboard />;
};

export default Dashboard; 