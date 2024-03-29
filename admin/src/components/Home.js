import React, { useContext } from 'react';
import { AlertContext } from './AlertContext';
import AlertComponent from './AlertComponent'; // If you want to display alerts in this component

const HomePage = () => {
  const { addAlert } = useContext(AlertContext);

  // Function to show an alert
  const showWelcomeMessage = () => {
    addAlert('Welcome to the HomePage!');
  };
 
  return (
    <div className=''>
      <div className='alert alert-primary alert-dimissable m-3 fixed-bottom' role='alert'>
      <AlertComponent />
        Welcome to the Maximal Web App! Please complete your <a href="/UserProfile" className="alert-link">profile</a></div>
      {/* Add more content and structure as needed */}
    </div>
  );
}


export default HomePage;
