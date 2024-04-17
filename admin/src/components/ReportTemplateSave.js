import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';

const ReportTemplateSave = () => {
  const { reportTempId } = useParams();

  const [columnName, setColumnName] = useState('');
  const [dataType, setDataType] = useState('');
  const [columnCount, setColumnCount] = useState(1);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Document Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (reportTempId) {
      const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setReportName(data.name);
            setReportType(data.type);
            setColumns(data.columns || []); // Ensure columns is always initialized as an array
            setEmployeeUserId(data.employeeUserId);
            setCustomerUserId(data.customerUserId);
          } else {
            setErrorMessage('Report template not found');
          }
        })
        .catch((error) => {
          setErrorMessage(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  const handleAddColumn = () => {
    setColumns([...columns, { name: columnName, type: dataType }]);
    setColumnName('');
    setDataType('');
  };

  const handleUpdateReportTemplate = () => {
    const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
    const updatedReportTemplate = {
      name: reportName,
      type: reportType,
      columns: columns,
      employeeUserId: employeeUserId,
      customerUserId: customerUserId
    };

    set(reportTemplateRef, updatedReportTemplate)
      .then(() => {
        setSuccessMessage('Report Template Updated successfully!');
      })
      .catch((error) => {
        setErrorMessage(`Error updating report template: ${error.message}`);
      });
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-6 py-4" style={{ color: '#735744', height:'680px' }}>
          <h2 className='text-center'>Report Template</h2>
          {/* Form inputs */}
          {/* Report Name and Type inputs */}
          <div className="form-group row">
            <div className="col-md-6">
              <label htmlFor="reportName">Report Name:</label>
              <input
                type="text"
                className="form-control"
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="reportType">Report Type:</label>
              <select
                className="form-control"
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="Document Report">Document Report</option>
                <option value="Tabular Report">Tabular Report</option>
              </select>
            </div>
          </div>
          {/* Employee and Customer User ID inputs */}
          <div className='row'>
            <div className="form-group col-md-6">
              <label htmlFor="employeeUserId">Employee User ID:</label>
              <input
                type="text"
                className="form-control"
                id="employeeUserId"
                value={employeeUserId}
                onChange={(e) => setEmployeeUserId(e.target.value)}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="customerUserId">Customer User ID:</label>
              <input
                type="text"
                className="form-control"
                id="customerUserId"
                value={customerUserId}
                onChange={(e) => setCustomerUserId(e.target.value)}
              />
            </div>
          </div>
          {/* Column Name and Data Type inputs */}
          <div className='row'>
            <div className="form-group col-md-4">
              <label htmlFor="columnName">Column Name:</label>
              <input
                type="text"
                className="form-control"
                id="columnName"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="dataType">Data Type:</label>
              <select
                className="form-control"
                id="dataType"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                <option value="input">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="textarea">Text Area</option>
                <option value="photo">Photo Upload</option>
                {/* Add more options for other data types */}
              </select>
            </div>
            <div className='col-md-4'>
              <label htmlFor="dataType">Action:</label>
              <button className="btn btn-primary w-100" onClick={handleAddColumn}>Add Column</button>
            </div>
          </div>
          {/* Report Columns */}
          <h3>Report Columns:</h3>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Column Name</th>
                <th scope="col">Data Type</th>
              </tr>
            </thead>
            <tbody>
              {columns && columns.map((column, index) => ( // Check if columns is not undefined before mapping
                <tr key={index}>
                  <td>{column.name}</td>
                  <td>{column.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Number of Columns input */}
          <div className="form-group">
            <label htmlFor="columnCount">Number of Columns:</label>
            <input
              type="number"
              className="form-control"
              id="columnCount"
              value={columnCount}
              onChange={(e) => setColumnCount(e.target.value)}
            />
          </div>
          {/* Success and Error messages */}
          {successMessage && <div className="alert alert-success alert-dismissible fade show mt-3">{successMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}
          {errorMessage && <div className="alert alert-danger alert-dismissible fade show mt-3">{errorMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>}
          {/* Create Report Template button */}
          <button className="btn btn-success" onClick={handleUpdateReportTemplate}>Save Report Template</button>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateSave;
