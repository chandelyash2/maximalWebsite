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
  const [columns, setColumns] = useState([]);
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
        setReportName('Report'+" "+ numChildren);
      } else {
        setReportName('Report'+" 0");
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
        columns: [],
        companyName: '',
        companyLocation: '',
      });
      
      navigate(`/ReportCustomize/${newReportTempId}`);
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
 
  handleCreateReport();

  return (
<div className="container-fluid">
  <div className='row justify-content-center'>
    <div className='d-flex flex-column align-items-center fixed-width-container '>
      <Link to="/home">
      <button className="btn btn-danger my-2  w-100 mb-4 align-items-center"><h3>ADMINISTRATOR PORTAL</h3></button>
      </Link>
      <p className='mb-4 text-center'><h4>Creating Reporting...</h4></p>
  </div>
</div>
</div>
  );
}


export default Reporting;
