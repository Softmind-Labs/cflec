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
  latestNotification: Notification | null;
  clearLatest: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let idCounter = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  const addNotification = useCallback((message: string, icon: Notification['icon'] = 'info') => {
    const id = `notif-${++idCounter}-${Date.now()}`;
    const notif: Notification = { id, message, timestamp: new Date(), read: false, icon };
    setNotifications((prev) => [notif, ...prev].slice(0, 50));
    setLatestNotification(notif);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearLatest = useCallback(() => {
    setLatestNotification(null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll, latestNotification, clearLatest }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
