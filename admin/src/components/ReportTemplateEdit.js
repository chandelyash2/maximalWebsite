import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import { Link } from 'react-router-dom';

function ReportTemplateEdit() {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedReportName, setSelectedReportName] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [selectedCompanyLocation, setSelectedCompanyLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const reportTemplatesRef = ref(database, 'reportTemplates');

    // Fetch data from Firebase Realtime Database
    get(reportTemplatesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the object of objects into an array of objects
          const templatesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setReportTemplates(templatesArray);
        } else {
          setErrorMessage('No report templates found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching report templates: ${error.message}`);
      });

  }, []); // Empty dependency array ensures that the effect runs only once on component mount

  // Filtered report templates based on selected options
  const filteredTemplates = reportTemplates.filter(template =>
    (!selectedReportName || template.name === selectedReportName) &&
    (!selectedCompanyName || template.companyName === selectedCompanyName) &&
    (!selectedCompanyLocation || template.companyLocation === selectedCompanyLocation)
  );

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
    <div className="row justify-content-center" >
      <div className="col-md-8 py-4" style={{ color: '#735744', height:'680px' }}>
      <div className="text-center">
        <Link to="/home">
      <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>  </Link>
   
      </div>
      {/* Display select options for reportName, companyName, and companyLocation */}
      <div className="mb-3">
        <select id="reportName" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedReportName} onChange={(e) => setSelectedReportName(e.target.value)}>
          <option value="">Choose Report Name...</option>
          {[...new Set(reportTemplates.map(template => template.name))].map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <select id="companyName" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)}>
          <option value="">Choose Company Name...</option>
          {[...new Set(reportTemplates.map(template => template.companyName))].map((companyName, index) => (
            <option key={index} value={companyName}>{companyName}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <select id="companyLocation" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedCompanyLocation} onChange={(e) => setSelectedCompanyLocation(e.target.value)}>
          <option value="">Choose Location...</option>
          {[...new Set(reportTemplates.map(template => template.companyLocation))].map((companyLocation, index) => (
            <option key={index} value={companyLocation}>{companyLocation}</option>
          ))}
        </select>
      </div>

      {/* Display filtered report templates in a Bootstrap table */}
      <div className="table-responsive">
        <table className='w-100 table-bordered'>
          <thead>
            <tr>
              <th className='btn-danger rounded-pill text-center'>ID</th>
              <th className='btn-danger rounded-pill text-center'>Type</th>
              <th className='btn-danger rounded-pill text-center'>Report Name</th>
              <th className='btn-danger rounded-pill text-center'>Company Name</th>
              <th className='btn-danger rounded-pill text-center'>Location</th>
              <th className='btn-danger rounded-pill text-center'>Action</th>
              {/* Add additional table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map(template => (
              <tr key={template.id} className=''>
                <td className='text-center'><small>{template.id}</small></td>
                <td className='text-center'>{template.type}</td>
                <td className='text-center'>{template.name}</td>
                <td className='text-center'>{template.companyName}</td>
                <td className='text-center'>{template.companyLocation}</td>
                <td className='text-center'>
                  <Link to={template.type === "Tabular Report" ? `/ReportCustomizeTabular/${template.id}` : `/ReportCustomizeDocument/${template.id}`} className="btn btn-danger rounded-pill text-center"><i class="bi bi-pencil-square"></i></Link>
                </td>
                {/* Add additional table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        <p class='mt-3'><small>Note:- The ID is Report Template Database ID, helpful for identify during development phase, later we can hide it.</small></p>
      </div>

      {/* Display error message if any */}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
    </div>
    </div>
  );
}

export default ReportTemplateEdit;
