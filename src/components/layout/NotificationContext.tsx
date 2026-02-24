import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: 'info' | 'success' | 'warning' | 'course' | 'trade' | 'certificate';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, icon?: Notification['icon']) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let idCounter = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, icon: Notification['icon'] = 'info') => {
    const id = `notif-${++idCounter}-${Date.now()}`;
    setNotifications((prev) => [
      { id, message, timestamp: new Date(), read: false, icon },
      ...prev,
    ].slice(0, 50)); // keep max 50
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
