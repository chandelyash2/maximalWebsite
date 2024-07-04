// Sidebar.js
import React from 'react';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { auth } from '../firebaseconfig'; // Import the auth module
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after sign out

const Sidebar = () => {

  const navigate = useNavigate();

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
    <div className="sidebar">
        {/* <a className="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"> */}
        <div className="accordion" id="accordionmenu">

        <div className="accordion-item accordion-item1">
          <a className="w-100 d-flex justify-content-center" href="https://maximalsecurityservices.com/">
          <img src="../images/logo.png" className='logo' title="Visit Website"/>
          </a>
        </div>

        <div className="accordion-item accordion-item1">
          <a className="ps-4 btn-danger btn w-100" href="/home">Home</a>
        </div>

        <div className="accordion-item accordion-item1">
          <div className="accordion-header d-flex" id="headingOnestar">
            <a className="ps-4 btn-danger btn w-100" data-bs-toggle="collapse" data-bs-target="#collapseOnestar"
              aria-expanded="true" aria-controls="collapseOnestar">Reporting</a>
            {/* <button className="accordion-button p-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOnestar"
              aria-expanded="true" aria-controls="collapseOnestar"></button> */}

          </div>
          <div id="collapseOnestar" className="accordion-collapse collapse py-0" aria-labelledby="headingOnestar"
            data-bs-parent="#accordionmenu">
            <div className="accordion-body p-0 my-2">
              <a href="/Reporting" className='btn btn-danger w-100 my-2'>Create Report</a>
              <a href="/ReportTemplateEdit"  className='btn btn-danger w-100 my-2'> View Report</a>
              <a href="/ReportAssignUserPermissions" className='btn btn-danger w-100 my-2'>Assign Report</a>
            </div>
          </div>
        </div>

        <div className="accordion-item accordion-item1">
        <div className="accordion-header d-flex" id="headingTwotar">
             <a className="ps-4 btn-danger btn w-100" data-bs-toggle="collapse" data-bs-target="#collapseTwostar"
              aria-expanded="true" aria-controls="collapseTwostar">Schedule & Guard Management</a>
          </div>
          <div id="collapseTwostar" className="accordion-collapse collapse py-0" aria-labelledby="headingTwostar"
            data-bs-parent="#accordionmenu">
            <div className="accordion-body p-0 my-2">
              <a href="#" className='btn btn-danger w-100 my-2'>Assign Permissions</a>
              <a href="#"  className='btn btn-danger w-100 my-2'>Geolocation Set Up</a>
              <a href="#" className='btn btn-danger w-100 my-2'>Time Clock Set Up</a>
            </div>
          </div>
        </div>

        <div className="accordion-item accordion-item1">
        <div className="accordion-header d-flex" id="headingTwotar">
             <a className="ps-4 btn-danger btn w-100" data-bs-toggle="collapse" data-bs-target="#collapseTwostar"
              aria-expanded="true" aria-controls="collapseTwostar">Invoicing</a>
          </div>
          <div id="collapseTwostar" className="accordion-collapse collapse py-0" aria-labelledby="headingTwostar"
            data-bs-parent="#accordionmenu">
            <div className="accordion-body p-0 my-2">
              <a href="#" className='btn btn-danger w-100 my-2'>Set Up New Client</a>
              <a href="#"  className='btn btn-danger w-100 my-2'>Modify Client</a>
              <a href="#" className='btn btn-danger w-100 my-2'>Generate Invoice</a>
              <a href="#" className='btn btn-danger w-100 my-2'>View Open Invoices</a>
              <a href="#" className='btn btn-danger w-100 my-2'>View Paid Invoices</a>
              <a href="#" className='btn btn-danger w-100 my-2'>Invoice Statements</a>
            </div>
          </div>
        </div>

        <div className="accordion-item accordion-item1">
          <a className="ps-4 btn-danger btn w-100" href="#">Security Watch</a>
        </div>
        <div className="accordion-item accordion-item1">
          <a className="ps-4 btn-danger btn w-100" href="/UserList">User List</a>
        </div>
        <div className="accordion-item accordion-item1">
          <a className="ps-4 btn-danger btn w-100" href="/ClientList">Client List</a>
        </div>
        <div className="accordion-item accordion-item1">
          <a className="ps-4 btn-danger btn w-100" href="#">Client Hours</a>
        </div>
        <div className="accordion-item accordion-item1">
        <button onClick={handleSignOut} className='btn btn-danger px-5 my-2 w-100 text-warning'><i class="bi bi-box-arrow-left"></i> Sign Out</button>
        </div>

        </div>


    </div>
  );
};

export default Sidebar;
