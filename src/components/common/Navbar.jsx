import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Navbar = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2 md:ml-0 truncate">
              Dental Center
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <User size={20} className="text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {currentUser?.name || currentUser?.email}
              </span>
              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full whitespace-nowrap">
                {currentUser?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <LogOut size={20} className="flex-shrink-0" />
                  <span className="hidden md:inline text-sm whitespace-nowrap">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;