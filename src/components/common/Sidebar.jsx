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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          md:block w-64 flex-shrink-0 bg-white border-r border-gray-200
          ${isOpen ? '' : 'hidden'}
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
              {currentUser?.name || currentUser?.email}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()} // Close menu on mobile when link is clicked
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className={`
            md:hidden fixed inset-y-0 left-0 z-40
            w-64 bg-white border-r border-gray-200
          `}
        >
          {/* Mobile Content */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                  {currentUser?.name || currentUser?.email}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => onClose()}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;