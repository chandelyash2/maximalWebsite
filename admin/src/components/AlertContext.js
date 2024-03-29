// AlertContext.js
import React, { createContext, useState, useCallback } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message) => {
    setAlerts((prevAlerts) => {
      const id = new Date().getTime(); // Unique ID for each alert
      return [...prevAlerts, { id, message }];
    });
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
