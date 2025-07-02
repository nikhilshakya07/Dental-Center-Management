import { format, parseISO, isValid, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const dateUtils = {
  formatDate: (date, formatString = 'dd/MM/yyyy') => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, formatString) : '';
  },

  formatDateTime: (date) => {
    return dateUtils.formatDate(date, 'dd/MM/yyyy HH:mm');
  },

  formatTime: (date) => {
    return dateUtils.formatDate(date, 'HH:mm');
  },

  isToday: (date) => {
    const today = new Date();
    const compareDate = typeof date === 'string' ? parseISO(date) : date;
    return format(today, 'yyyy-MM-dd') === format(compareDate, 'yyyy-MM-dd');
  },

  isFuture: (date) => {
    const compareDate = typeof date === 'string' ? parseISO(date) : date;
    return compareDate > new Date();
  },

  isPast: (date) => {
    const compareDate = typeof date === 'string' ? parseISO(date) : date;
    return compareDate < new Date();
  },

  getCalendarDays: (month, year) => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    return eachDayOfInterval({ start, end });
  },

  addDaysToDate: (date, days) => {
    const baseDate = typeof date === 'string' ? parseISO(date) : date;
    return addDays(baseDate, days);
  }
};