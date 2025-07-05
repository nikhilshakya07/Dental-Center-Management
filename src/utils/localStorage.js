const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_KEY;
if (!STORAGE_PREFIX) {
  throw new Error('Storage key not configured. Please check your environment variables.');
}

const STORAGE_KEYS = {
    USERS: `${STORAGE_PREFIX}_users`,
    PATIENTS: `${STORAGE_PREFIX}_patients`,
    APPOINTMENTS: `${STORAGE_PREFIX}_appointments`,
    CURRENT_USER: `${STORAGE_PREFIX}_current_user`
};
  
export const localStorageService = {
    initializeData: (data) => {
      Object.entries(data).forEach(([key, value]) => {
        const storageKey = STORAGE_KEYS[key.toUpperCase()];
        if (storageKey && !localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      });
    },
  
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
    
    getUsers: () => localStorageService.getItem(STORAGE_KEYS.USERS) || [],
    setUsers: (users) => localStorageService.setItem(STORAGE_KEYS.USERS, users),
  
    getPatients: () => localStorageService.getItem(STORAGE_KEYS.PATIENTS) || [],
    setPatients: (patients) => localStorageService.setItem(STORAGE_KEYS.PATIENTS, patients),
  
    getAppointments: () => localStorageService.getItem(STORAGE_KEYS.APPOINTMENTS) || [],
    setAppointments: (appointments) => localStorageService.setItem(STORAGE_KEYS.APPOINTMENTS, appointments),
  
    getCurrentUser: () => localStorageService.getItem(STORAGE_KEYS.CURRENT_USER),
    setCurrentUser: (user) => localStorageService.setItem(STORAGE_KEYS.CURRENT_USER, user),
  
    clearCurrentUser: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),
  
    generateId: () => Date.now().toString() + Math.random().toString(36).substr(2, 9),
    
    clearAll: () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
};