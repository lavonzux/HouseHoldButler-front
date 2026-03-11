import React, { createContext, useContext, useState } from 'react';
import { mockReminders } from '@/mockData/Reminders';
import type { Reminder } from '@/types/reminder';

interface NotificationContextType {
  notifications: Reminder[];
  unreadCount: number;
  markAsRead: (id: number | string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Reminder[]>(mockReminders);

  const unreadCount = notifications.filter(n => n.reminderStatus === 'UNREAD').length;

  const markAsRead = (id: number | string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, reminderStatus: 'READ' } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, reminderStatus: 'READ' })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};