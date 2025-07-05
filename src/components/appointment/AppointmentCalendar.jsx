import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, 
         isSameDay, addMonths, subMonths, parseISO, isToday,
         startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AppointmentCalendar = ({ appointments = [], onDayClick, loading = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'
  const { isAdmin } = useAuth();

  // Get days based on current view
  const getDays = () => {
    if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const days = getDays();

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = format(parseISO(appointment.appointmentDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {});

  const handlePrevious = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const renderAppointmentIndicator = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayAppointments = appointmentsByDate[dateStr] || [];
    
    if (dayAppointments.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <div className="flex space-x-1">
          {dayAppointments.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-blue-500"
            />
          ))}
          {dayAppointments.length > 3 && (
            <span className="text-xs text-blue-500">+{dayAppointments.length - 3}</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex space-x-4 items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {view === 'week' 
              ? `Week of ${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded ${
                view === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded ${
                view === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, dayIdx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayAppointments = appointmentsByDate[dateStr] || [];
          
          return (
            <div
              key={day.toString()}
              className={`relative bg-white p-2 ${view === 'week' ? 'h-48' : 'h-32'} ${
                !isSameMonth(day, currentDate) && view === 'month'
                  ? 'text-gray-400 bg-gray-50'
                  : 'text-gray-700'
              } cursor-pointer hover:bg-gray-50`}
              onClick={() => onDayClick(day, dayAppointments)}
            >
              <div className={`text-right ${
                isToday(day) ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center ml-auto' : ''
              }`}>
                {format(day, 'd')}
              </div>
              {renderAppointmentIndicator(day)}
              <div className={`mt-1 space-y-1 overflow-y-auto ${view === 'week' ? 'max-h-36' : 'max-h-20'}`}>
                {dayAppointments.map((appointment, idx) => (
                  <div
                    key={idx}
                    className="text-xs p-1 rounded bg-blue-50 text-blue-700 truncate"
                  >
                    {format(parseISO(appointment.appointmentDate), 'HH:mm')} -{' '}
                    {appointment.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendar; 