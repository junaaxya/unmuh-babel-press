// src/hooks/useNotification.js
"use client";

import { useState, useCallback } from 'react';
import Notification from '@/components/ui/Notification/Notification';

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((type, message, options = {}) => {
    const id = ++notificationId;
    const notification = {
      id,
      type,
      message,
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const NotificationContainer = useCallback(() => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </>
  ), [notifications, hideNotification]);

  return {
    showNotification,
    hideNotification,
    clearAllNotifications,
    NotificationContainer,
    notifications
  };
};

// Global notification context for app-wide usage
import { createContext, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notification = useNotification();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      <notification.NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useGlobalNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useGlobalNotification must be used within NotificationProvider');
  }
  return context;
};