import React, { useState } from 'react';
import { database } from '../firebaseconfig';

const ReportTemplateCreator = () => {
  const [columnName, setColumnName] = useState('');
  const [dataType, setDataType] = useState('');
  const [columnCount, setColumnCount] = useState(1);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Document Report'); // Default value for report type
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');

  const handleAddColumn = () => {
    setColumns([...columns, { name: columnName, type: dataType }]);
    setColumnName('');
    setDataType('');
  };

  const handleCreateReportTemplate = () => {
    const reportTemplateRef = database().ref('reportTemplates');
    const newReportTemplate = {
      name: reportName,
      type: reportType,
      columns: columns,
      employeeUserId: employeeUserId,
      customerUserId: customerUserId
    };
    reportTemplateRef.push(newReportTemplate);
    setReportName('');
    setReportType('Document Report'); // Reset report type after submission
    setColumns([]);
    setEmployeeUserId('');
    setCustomerUserId('');
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-6 py-4" style={{ color: '#735744', height:'680px' }}>
          <h2 className='text-center'>Create Report Template</h2>
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
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            {/* Add more options for other data types */}
          </select>
        </div>
        <div className='col-md-4'>
        <label htmlFor="dataType">Action:</label>
        <button className="btn btn-primary w-100" onClick={handleAddColumn}>Add Column</button>
        </div>
        </div>
        <h3>Report Columns:</h3>
        <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Column Name</th>
          <th scope="col">Data Type</th>
        </tr>
      </thead>
      <tbody>
        {columns.map((column, index) => (
          <tr key={index}>
            <td>{column.name}</td>
            <td>{column.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
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

        <button className="btn btn-success" onClick={handleCreateReportTemplate}>Create Report Template</button>

      
      </div>
    </div>
    </div>
  );
};

export default ReportTemplateCreator;
