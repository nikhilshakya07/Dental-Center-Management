import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  X,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: FileText },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  const patientNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', href: '/appointments', icon: FileText },
  ];

  const navItems = isAdmin() ? adminNavItems : patientNavItems;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? 'opacity-50 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 left-0 md:static md:block w-64 flex-shrink-0 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out transform h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          z-50 md:z-0
        `}
      >
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
              {currentUser?.name || currentUser?.email}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-1rem)]">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;