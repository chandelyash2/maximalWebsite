// AlertComponent.js
import React, { useContext } from 'react';
import { AlertContext } from './AlertContext';

const AlertComponent = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <div>
      {alerts.map((alert) => (
        <div key={alert.id}>
          {alert.message}
          <button onClick={() => removeAlert(alert.id)}>Close</button>
        </div>
      ))}
    </div>
  );
};

export default AlertComponent;
