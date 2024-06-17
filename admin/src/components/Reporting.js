import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, get, push, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import { AlertContext } from './AlertContext';
import '../css/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Reporting = () => {
  const { addAlert } = useContext(AlertContext);
  let navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to show an alert
  const showWelcomeMessage = () => {
    addAlert('Welcome to the HomePage!');
  };

  const handleCreateReport = () => {
    const TemplateRef = ref(database, `reportTemplates`);
    get(TemplateRef).then((snapshot) => {
      if (snapshot.exists()) {
        const numChildren = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
        setReportName(reportType+" "+ numChildren);
      } else {
        setReportName(reportType+" 0");
      }
    }).catch((error) => {
      alert("Error getting data: " + error.message);
    });

  const handleSaveReport = async () => {
    const reportTempRef = push(ref(database, 'reportTemplates'));
    const newReportTempId = reportTempRef.key;
  
    try {
      await set(ref(database, `reportTemplates/${newReportTempId}`), {
        name: reportName,
        type: reportType,
        columns: [],
        employeeUserId: employeeUserId,
        customerUserId: customerUserId,
        companyName: '',
        companyLocation: '',
      });
      
      navigate(`/ReportCustomizeHybrid/${newReportTempId}`);
    } catch (error) {
      alert('Error saving report Template:' + error);
    }
  };

  handleSaveReport()
  .then(() => {
    setSuccessMessage('New Report Template Created successfully.!');
  })
  .catch((error) => {
    setErrorMessage(`Error: ${error.message}`);
  });
  };
 
  return (
<div className="container-fluid">
  <div className='row justify-content-center'>
    <div className='d-flex flex-column align-items-center fixed-width-container '>
      <Link to="/home">
      <button className="btn btn-danger my-2  w-100 mb-4 align-items-center"><h3>ADMINISTRATOR PORTAL</h3></button>
      </Link>
      <p className='mb-4 text-center'><h4> Reporting</h4></p>
      <div className='row d-flex flex-column align-items-center'>
        <div className='fixed-width'>
        <button className='btn btn-danger  my-2 w-100' onClick={handleCreateReport}>Create New Report</button>
        <Link to="/ReportTemplateEdit"><button className='btn btn-danger my-2 w-100'>Edit Existing Report</button></Link>
        {/* <button className='btn btn-danger rounded-pill  my-2 w-100'>Replicate Existing Report</button> */}
        <Link to="/ReportAssignUserPermissions"><button className='btn btn-danger my-2 w-100'>Assign User Permissions</button></Link> 
    
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
