import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PatientProvider } from './contexts/PatientContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PatientProvider>
          <AppointmentProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AppointmentProvider>
        </PatientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
