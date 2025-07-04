import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageService } from '../utils/localStorage';
import { initialData } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data on first load
    localStorageService.initializeData(initialData);
    
    // Check for existing user session
    const savedUser = localStorageService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate network request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = localStorageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userSession = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        patientId: user.patientId
      };
      
      setCurrentUser(userSession);
      localStorageService.setCurrentUser(userSession);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = async () => {
    // Simulate network request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    localStorageService.clearCurrentUser();
  };

  const isAdmin = () => {
    return currentUser?.role === 'Admin';
  };

  const isPatient = () => {
    return currentUser?.role === 'Patient';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isPatient,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};