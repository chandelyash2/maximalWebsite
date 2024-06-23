import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlertContext } from './AlertContext';
import AlertComponent from './AlertComponent'; // If you want to display alerts in this component
import { auth } from '../firebaseconfig'; // Import the auth module
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after sign out

import '../css/style.css';

const HomePage = () =>  {
  
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  
  const showWelcomeMessage = () => {
    addAlert('Welcome to the HomePage!');

    
  };
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login page after sign out
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
 
  return ( 
<div className="container-fluid">
  <div className='row justify-content-center'>
    <div className='fixed-width-container d-flex flex-column align-items-center'>
    
      <h3 class="text-center mb-4 my-2">ADMINISTRATOR PORTAL</h3>

      <div className='row d-flex flex-column align-items-center'>
        <div className='fixed-width'>
        <Link to="/Reporting"><button className='btn btn-danger px-5 my-2 w-100'>Reporting</button></Link>
      <button className='btn btn-danger px-5 my-2 w-100'>Checkpoint Tour</button>
      <button className='btn btn-danger my-2 w-100'>Community Watch</button>
      <button className='btn btn-danger px-5 my-2 w-100'>Payroll/Geolocation</button>
      <button className='btn btn-danger px-5 my-2 w-100'>Invoicing</button>
      <Link to="/UserList">
      <button className='btn btn-danger  my-2 w-100'>User List</button>
      </Link>
      <button onClick={handleSignOut} className='btn btn-danger px-5 my-2 w-100 text-warning'><i class="bi bi-box-arrow-left"></i> Sign Out</button>
        </div>
      </div>

    </div>
  </div>

</div>

  );
}


export default HomePage;
