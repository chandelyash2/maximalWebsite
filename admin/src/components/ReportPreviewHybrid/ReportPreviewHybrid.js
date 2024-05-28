import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../../firebaseconfig';
// import Tabular from './Tabular';
// import Toogle from './Toogle';
// import Document from './Document';

const ReportPreviewHybrid = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();

  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [tables, setTables] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [orientation, setOrientation] = useState('portrait');

  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };

  const generatePDF = () => {
  }

  const generateExcel = () => {

  }
  useEffect(() => {
    if (reportTempId) {
      const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setReportName(data.name);
            setReportType(data.type);
            setTables(data.tables || []);
            setCompanyName(data.companyName);
            setCompanyLocation(data.companyLocation);
          } else {
            setErrorMessage('Report template not found');
          }
        })
        .catch((error) => {
          setErrorMessage(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5">
                <h3>ADMINISTRATOR PORTAL</h3>
              </button>
            </Link>
          </div>
          <div className="text-center">
            <button className="btn w-25 btn-danger text-center m-auto rounded-pill mb-3">{reportName}</button><br/>
            <select className='btn rounded-pill btn-danger' value={orientation} onChange={handleOrientationChange}
            title='Orientation'>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
           <button className="btn btn-warning text-center m-auto rounded-pill me-1" onClick={generatePDF}>Export PDF <i className="bi bi-filetype-pdf"></i></button>
           <button className="btn btn-success text-center m-auto rounded-pill" onClick={generateExcel}>Export Excel <i class="bi bi-filetype-xls"></i></button>
          </div>
          <div>
             <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyName}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyLocation}</button>
          </div>
       </div>
       </div>
    </div>
  );
};

export default ReportPreviewHybrid;
