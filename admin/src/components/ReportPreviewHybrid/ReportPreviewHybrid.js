import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../../firebaseconfig';

const ReportPreviewHybrid = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();

  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [tables, setTables] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [orientation, setOrientation] = useState('portrait');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
            alert('Report template not found');
          }
        })
        .catch((error) => {
          alert(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };

  const generatePDF = () => {
    // Implementation for generating PDF
  };

  const generateExcel = () => {
    // Implementation for generating Excel
  };

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
            <button className="btn w-25 btn-danger text-center m-auto rounded-pill mb-3">{reportName}</button>
            <Link className="btn btn-danger text-center m-auto rounded-pill mb-3"
                  to={`/ReportCustomizeHybrid/${reportTempId}`}
                   title='Edit'><i className="bi bi-pencil-square"></i></Link>
            <br />
            <select className='btn rounded-pill btn-danger' value={orientation} onChange={handleOrientationChange} title='Orientation'>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
            <button className="btn btn-warning text-center m-auto rounded-pill me-1" onClick={generatePDF}>Export PDF <i className="bi bi-filetype-pdf"></i></button>
            <button className="btn btn-success text-center m-auto rounded-pill" onClick={generateExcel}>Export Excel <i className="bi bi-filetype-xls"></i></button>
          </div>
          <div>
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
            <button className="btn w-75 my-1 m-auto rounded-pill text-start ps-5">{companyName}</button>
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
            <button className="btn w-75 my-1 m-auto rounded-pill text-start ps-5">{companyLocation}</button>
          </div>

          {tables.map((table, tableIndex) => (
            <div key={tableIndex} className='my-2'>
              <h4 className='mt-3 text-dark'>{table.name}</h4>
              {table.type === "Tabular" && (
                <div>
                  <table className="w-100" width="100%">
                    <thead className="thead-dark">
                      <tr className="w-100 d-flex justify-content-start">
                        {table.columns && table.columns
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((column, index) => (
                            <th scope="col" className='btn-danger rounded text-center d-flex justify-content-center align-items-center' width={column.width + "%"} key={index}>
                              {column.title}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                    <tr className="w-100 d-flex justify-content-start">
                    {table.columns && table.columns
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((column, index) => (
                            <th scope="col" className='border border-1 border-light text-center' width={column.width + "%"} key={index}>
                              ..data..
                            </th>
                          ))}
                          </tr>
                    </tbody>
                  </table>
                  <hr />
                </div>
              )}

              {table.type === "Document" && (
                <div>    
                  {table.columns && table.columns
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((column, index) => (
                      column.title === 'blank' ? (
                        <div key={index} className="w-50" style={{ display: 'inline-block', minHeight: column.height + "px" }}>
                        </div>
                      ) : (
                        <div key={index} style={{ display: column.width === '100%' ? 'block' : 'inline-block', width: column.width === '100%' ? '100%' : '45%' }}>
                          <button className="btn my-1 btn-danger text-center rounded" style={{ width: column.width === '100%' ? '24%' : '49%' }}>{column.title}</button>
                          <p className={`my-1 pt-3 text-start overflow-auto ps-5 ${column.border === "Yes" ? 'border border-1 border-dark' : ''}`} style={{ display: column.width === '100%' ? 'block' : 'inline-block', width: column.width === '100%' ? '100%' : '48%', minHeight: column.height + "px" }}>.....data.....</p>
                        </div>
                      )
                    ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ReportPreviewHybrid;
