import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import { AlertContext } from './AlertContext';
import { ref, get, push, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import '../css/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ReportCreateNew = () => {
  let navigate = useNavigate();
  const [columnName, setColumnName] = useState('');
  const [dataType, setDataType] = useState('');
  const [columnCount, setColumnCount] = useState(1);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Tabular Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [reportTempdId, setReportTempId] = useState('');

  const handleCreateReportDocument = () => {
    alert("Sorry, Document Report is under construction.");
  };

  const handleCreateReportTabular = () => {
    const TemplateRef = ref(database, `reportTemplates`);
    get(TemplateRef).then((snapshot) => {
      if (snapshot.exists()) {
        const numChildren = snapshot.val() ? Object.keys(snapshot.val()).length : 0;
        setReportName("Tabular Report " + numChildren);
      } else {
        setReportName("Tabular Report 0");
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
          columns: columns,
          employeeUserId: employeeUserId,
          customerUserId: customerUserId
        });
        setReportTempId(newReportTempId);
      } catch (error) {
        alert('Error saving report Template:' + error);
      }
    };

    handleSaveReport()
      .then(() => {
        setSuccessMessage('New Report Template Created successfully.!');
        setTimeout(() => {
          navigate('/ReportTemplateCreator');
        }, 2000); // 2 seconds delay
      })
      .catch((error) => {
        setErrorMessage(`Error: ${error.message}`);
      });

    setReportName('');
    setReportType('Tabular Report');
    setColumns([]);
    setEmployeeUserId('');
    setCustomerUserId('');
  };

  const handleSubmit = () => {
    if (reportType === 'Tabular Report') {
      handleCreateReportTabular();
    } else if (reportType === 'Document Report') {
      handleCreateReportDocument();
    }
  };

  return (
    <div className="container-fluid">
      <div className='row justify-content-center'>
        <div className='col-lg-5 d-flex flex-column px-5 align-items-center'>
          <Link to="/home">
            <button className="btn btn-danger mb-4 rounded-pill px-5 w-100"><h2>ADMINISTRATOR PORTAL</h2></button>
          </Link>
          <Link to="/Reporting" className='w-75'>
            <button className='btn btn-danger rounded-pill px-5 my-3 mb-4 w-100'>
              <h4> <i className="bi bi-arrow-left-square"></i>&nbsp;&nbsp; Create New Report</h4>
            </button>
          </Link>
          <div className='row d-flex flex-column align-items-center'>
            <button className='btn btn-danger rounded-pill px-5 my-2 w-100 mb-3'>Select Report Type</button>
            <div>
              <select className="form-control" id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} size="2">
                <option value="Tabular Report">Tabular Report</option>
                <option value="Document Report">Document Report</option>
              </select>
            </div>
            <button className='btn btn-danger rounded-pill px-5 my-2 w-100 mt-3' onClick={handleSubmit}>Submit</button>
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

export default ReportCreateNew;
