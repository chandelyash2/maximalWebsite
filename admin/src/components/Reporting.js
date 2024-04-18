import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlertContext } from './AlertContext';
import '../css/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Reporting = () => {
  const { addAlert } = useContext(AlertContext);

  // Function to show an alert
  const showWelcomeMessage = () => {
    addAlert('Welcome to the HomePage!');
  };
 
  return (
<div className="container-fluid">
  <div className='row justify-content-center'>
    <div className='col-lg-5 d-flex flex-column px-5 align-items-center'>
      <Link to="/home">
      <button className="btn btn-danger mb-4 rounded-pill px-5 w-100"><h2>ADMINISTRATOR PORTAL</h2></button>
      </Link>
      <Link to="/home" className='w-75'><button className='btn btn-danger rounded-pill px-5 my-3 mb-4 w-100'><h4> <i class="bi bi-arrow-left-square"></i>&nbsp;&nbsp; Reporting</h4></button></Link>
      <div className='row d-flex flex-column align-items-center'>
        <div className='col-md-8'>
        <Link to="/ReportTemplateNew"><button className='btn btn-danger rounded-pill px-5 my-2 w-100'>Create New Report</button></Link>
        <button className='btn btn-danger rounded-pill px-5 my-2 w-100'>Edit Existing Report</button>
        <button className='btn btn-danger rounded-pill px-5 my-2 w-100'>Replicate Existing Report</button>
     
   
      <button className='btn btn-danger rounded-pill px-5 my-2 w-100'>Community Watch</button>
      <Link to="/MakeAdmin">
      <button className='btn btn-danger rounded-pill px-5 my-2 w-100'>Assign/Edit User Access</button>
      </Link>
        </div>
      </div>

    </div>
  </div>
</div>

  );
}


export default Reporting;
