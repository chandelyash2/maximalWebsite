import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';

const ReportTabularCustomize = () => {
  const { reportTempId } = useParams();
  let navigate = useNavigate();

  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Document Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
            setCompanyName(data.companyName);
            setCompanyLocation(data.companyLocation);
            setEmployeeUserId(data.employeeUserId);
            setCustomerUserId(data.customerUserId);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
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
    setColumns([...columns, { sequence: '', rowcol: 'row', title: 'title',  width: '10', format: 'Text' }]);
  };

  const handleUpdateReportTemplate = () => {
    const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
    const updatedReportTemplate = {
      name: reportName,
      type: reportType,
      columns: columns,
      employeeUserId: employeeUserId,
      customerUserId: customerUserId,
      companyName: companyName,
      companyLocation: companyLocation,
      startDate: startDate,
      endDate: endDate,
    };

    set(reportTemplateRef, updatedReportTemplate)
      .then(() => {
        setSuccessMessage('Report Template Updated successfully!');
      })
      .catch((error) => {
        setErrorMessage(`Error updating report template: ${error.message}`);
      });
  };

  const handleChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleDeleteRow = (index) => {
    setColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];
      updatedColumns.splice(index, 1);
      return updatedColumns;
    });
  };

  const handlePreview = () => { 
    navigate(`/ReportTabularPreview/${reportTempId}`);
  };
  

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-8 py-4" style={{ color: '#735744', height:'680px' }}>
      <div className="text-center">
        <Link to="/home">
      <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>  </Link>
   
      </div>
      <div className="text-center">
      <input
                type="text"
                className="form-control w-25 btn-danger text-center m-auto rounded-pill"
                id="reportName"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder='Report Name....'
      />
    
      </div>
          {/* Form inputs */}
          {/* Report Name and Type inputs */}
          <div className="form-group row">
            <div className="col-md-6">
            <input
                type="text"
                className="form-control btn-danger rounded-pill w-75  my-2"
                id="companyNameID"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name..."
              />

              <input
                type="text"
                className="form-control btn-danger rounded-pill w-75  my-2"
                id="companyLocationID"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                placeholder="Company Location..."
              />

              <input
                type="date"
                className="form-control btn-danger rounded-pill w-75 my-2"
                id="startDateID"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                // JavaScript to handle the placeholder behavior
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                placeholder="Report Start Date..."
              />


<input
                type="date"
                className="form-control btn-danger rounded-pill w-75  my-2"
                id="endDateID"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Report End Date..."
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              />
            
             
            </div>
            <div className="col-md-6">
            <p className='pt-2'>Customizing Report Template ID: <span className='text-success'><b>{reportTempId}</b></span></p>
                 {/* Success and Error messages */}
                {successMessage && <div className="alert alert-success alert-dismissible fade show mt-3">{successMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}
                {errorMessage && <div className="alert alert-danger alert-dismissible fade show mt-3">{errorMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

            </div>
          </div>

          {/* Report Columns */}
          <hr/>
          <table className="" width="100%">
            <thead className="thead-dark">
              <tr>
              <th scope="col" className='btn-danger rounded-pill text-center' width="15%">Sequence</th>
              <th scope="col" className='btn-danger rounded-pill text-center px-2' width="15%">Row/Column</th>
                <th scope="col" className='btn-danger rounded-pill text-center' width="30%">Title</th>
                <th scope="col" className='btn-danger rounded-pill text-center' width="15%">Width(%)</th>
                <th scope="col" className='btn-danger rounded-pill text-center'>Specific Format</th>
                <th scope="col" className='text-center'>
                  <button className="btn btn-success rounded-pill text-center w-100" onClick={handleAddColumn}><i class="bi bi-plus-circle"></i></button>
                  </th>
              </tr>
            </thead>
            
            <tbody>
            {columns && columns.map((column, index) => (
  <tr key={index}>
    <td>
      <input
        className="form-control btn-danger rounded-pill my-1 text-center"
        type="number"
        value={column.sequence}
        onChange={(e) => handleChange(index, 'sequence', e.target.value)}
        size="5"
      />
    </td>
    <td>
      <select
        className="form-control btn-danger rounded-pill my-1 text-center w-100"
        value={column.rowcol}
        onChange={(e) => handleChange(index, 'rowcol', e.target.value)}
      >
        <option value="Row">Row</option>
        <option value="Column">Column</option>
      </select>
    </td>
    <td>
      <input
        className="form-control btn-danger rounded-pill my-1 text-center w-100"
        type="text"
        value={column.title}
        onChange={(e) => handleChange(index, 'title', e.target.value)}
      />
    </td>
    <td>
      <input
        className="form-control btn-danger rounded-pill my-1 text-center w-100"
        type="text"
        value={column.width}
        onChange={(e) => handleChange(index, 'width', e.target.value)}
      />
    </td>
    <td>
      <select
        className="form-control btn-danger rounded-pill my-1 text-center w-100"
        value={column.format}
        onChange={(e) => handleChange(index, 'format', e.target.value)}
      >
        <option value="input">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="textarea">Text Area</option>
        <option value="photo">Photo Upload</option>
      </select>
    </td>
    <td>
      <button
        className="form-control btn btn-warning rounded-pill my-1 text-center "
        onClick={() => handleDeleteRow(index)}
      >
        <i class="bi bi-trash3"></i>
      </button>
    </td>
  </tr>
))}

            </tbody>
          </table>
        
      
          {/* Create Report Template button */}
          <hr/>
          <div className='text-center'>
          <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handlePreview}>Preview</button>
          <button className="btn btn-danger px-5 m-auto my-2" onClick={handleUpdateReportTemplate}>Save </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTabularCustomize;
