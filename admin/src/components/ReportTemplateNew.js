import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, get, push, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import '../css/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ReportTemplateNew = () => {
  let navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Tabular Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateReportDocument = () => {
    alert("Sorry, Document Report is under construction.");
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
        // alert(newReportTempId);
        // Navigate to ReportTemplateSave immediately after saving report template
        if(reportType=="Tabular Report")
        {
        navigate(`/ReportCustomizeTabular/${newReportTempId}`);
        }
        if(reportType=="Document Report")
        {
          navigate(`/ReportCustomizeDocument/${newReportTempId}`);
        }
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
        <div className='fixed-width-container d-flex flex-column align-items-center'>
          <Link to="/home">
            <button className="btn btn-danger mb-4 rounded-pill  w-100"><h3>ADMINISTRATOR PORTAL</h3></button>
          </Link>        
              <h3 className='text-center my-2 mb-4'> Create New Report</h3>

          <div className='row fixed-width d-flex flex-column align-items-center'>
            {/* <button className='btn btn-danger rounded-pill px-5 my-2 w-100 mb-3'>Select Report Type</button> */}
            <div class="fixed-width">

              <select className="custom-select" id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} size="2">
                <option value="Tabular Report">Tabular Report</option>
                <option value="Document Report">Document Report</option>
              </select>
            </div>
            <button className='btn btn-danger rounded-pill my-2 w-100 mt-3' onClick={handleCreateReport}>Submit</button>
            {errorMessage && (
              <p className='alert alert-danger text-danger alert-dismissible fade show' role='alert'>
                Error: {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className='alert alert-success alert-dismissible fade show text-success' role='alert'>
                Success: {successMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTemplateNew;
