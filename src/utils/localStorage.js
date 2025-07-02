const STORAGE_KEYS = {
    USERS: 'dental_users',
    PATIENTS: 'dental_patients',
    APPOINTMENTS: 'dental_appointments',
    CURRENT_USER: 'dental_current_user'
  };
  
  export const localStorageService = {
    // Initialize data
    initializeData: (data) => {
      Object.entries(data).forEach(([key, value]) => {
        const storageKey = STORAGE_KEYS[key.toUpperCase()];
        if (storageKey && !localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      });
    },
  
    // Generic get/set methods
    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    },
  
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
        return false;
      }
    },
  
    // Specific methods for our app
    getUsers: () => localStorageService.getItem(STORAGE_KEYS.USERS) || [],
    setUsers: (users) => localStorageService.setItem(STORAGE_KEYS.USERS, users),
  
    getPatients: () => localStorageService.getItem(STORAGE_KEYS.PATIENTS) || [],
    setPatients: (patients) => localStorageService.setItem(STORAGE_KEYS.PATIENTS, patients),
  
    getAppointments: () => localStorageService.getItem(STORAGE_KEYS.APPOINTMENTS) || [],
    setAppointments: (appointments) => localStorageService.setItem(STORAGE_KEYS.APPOINTMENTS, appointments),
  
    getCurrentUser: () => localStorageService.getItem(STORAGE_KEYS.CURRENT_USER),
    setCurrentUser: (user) => localStorageService.setItem(STORAGE_KEYS.CURRENT_USER, user),
  
    clearCurrentUser: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),
  
    // Helper methods
    generateId: () => Date.now().toString() + Math.random().toString(36).substr(2, 9),
    
    clearAll: () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  };
  
  export { STORAGE_KEYS };