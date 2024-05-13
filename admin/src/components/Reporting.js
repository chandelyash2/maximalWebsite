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
    <div className='fixed-width-container d-flex flex-column align-items-center'>
      <Link to="/home">
      <button className="btn btn-danger my-2 rounded-pill w-100 mb-4 align-items-center"><h3>ADMINISTRATOR PORTAL</h3></button>
      </Link>
      <p className='mb-4 text-center'><h4> Reporting</h4></p>
      <div className='row d-flex flex-column align-items-center'>
        <div className='fixed-width'>
        <Link to="/ReportTemplateNew"><button className='btn btn-danger rounded-pill my-2 w-100'>Create New Report</button></Link>
        <Link to="/ReportTemplateEdit"><button className='btn btn-danger rounded-pill my-2 w-100'>Edit Existing Report</button></Link>
        {/* <button className='btn btn-danger rounded-pill  my-2 w-100'>Replicate Existing Report</button> */}
     
      <Link to="/UserList">
      <button className='btn btn-danger rounded-pill  my-2 w-100'>User Access</button>
      </Link>
      {/* <Link to="/MakeAdmin">
      <button className='btn btn-danger rounded-pill  my-2 w-100'>Assign/Edit User Access</button>
      </Link> */}
        </div>
      </div>

    </div>
  </div>
</div>

  );
}


export default Reporting;
