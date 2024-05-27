// src/components/ReportCustomizeHybrid/ReportCustomizeHybrid.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../../firebaseconfig';
import ColumnRow from './ColumnRow';
import BoolColumnRow from './BoolColumnRow';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../css/style.css';

const ReportCustomizeHybrid = () => {
  const { reportTempId } = useParams();
  let navigate = useNavigate();

  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [columns, setColumns] = useState([]);
  const [headerColumns, setHeaderColumns] = useState([]);
  const [boolColumns, setBoolColumns] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
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
            setHeaderColumns(data.headerColumns || []);
            setColumns(data.columns || []);
            setBoolColumns(data.boolColumns || []);
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

  const handleAddColumn = () => {
    setColumns([...columns, { sequence: '', position: 'Header', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No' }]);
  };

  const handleHeaderAddColumn = () => {
    setHeaderColumns([...headerColumns, { sequence: '', position: 'Header', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No' }]);
  };

  const handleAddBoolColumn = () => {
    setBoolColumns([...boolColumns, { sequence: '', title: 'Title', item: '', description: 'No', options: [] }]);
  };

  const handleUpdateReportTemplate = (e) => {
    e.preventDefault();
    const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
    const updatedReportTemplate = {
      name: reportName,
      type: reportType,
      headerColumns: headerColumns,
      columns: columns,
      boolColumns: boolColumns,
      companyName: companyName,
      companyLocation: companyLocation
    };

    set(reportTemplateRef, updatedReportTemplate)
      .then(() => {
        setSuccessMessage('Report template updated successfully');
        // setTimeout(() => {
        //   navigate('/reportTemplateList');
        // }, 2000);
      })
      .catch((error) => {
        setErrorMessage(`Error updating report template: ${error.message}`);
      });
  };

  const handleChange = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);
  };

  const handleHeaderChange = (index, field, value) => {
    const updatedColumns = [...headerColumns];
    updatedColumns[index][field] = value;
    setHeaderColumns(updatedColumns);
  };

  const handleBoolChange = (index, field, value) => {
    const updatedBoolColumns = [...boolColumns];
    updatedBoolColumns[index][field] = value;
    setBoolColumns(updatedBoolColumns);
  };

  const handleBChange = () => {

  }

  const handleAddOption = (index, newOption) => {
    const updatedBoolColumns = [...boolColumns];
    updatedBoolColumns[index].options.push(newOption);
    setBoolColumns(updatedBoolColumns);
  };

  const handleDeleteRow = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleHeaderDeleteRow = (index) => {
    const updatedColumns = [...headerColumns];
    updatedColumns.splice(index, 1);
    setHeaderColumns(updatedColumns);
  };

  const handleDeleteBoolRow = (index) => {
    const updatedBoolColumns = [...boolColumns];
    updatedBoolColumns.splice(index, 1);
    setBoolColumns(updatedBoolColumns);
  };


  const handlePreview = () => {
    const reportData = {
      columns: columns,
      boolColumns: boolColumns,
    };
    navigate(`/previewReport/${reportTempId}`, { state: reportData });
  };

 

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
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

      <form className="mb-4">
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

              <p className='btn-danger rounded-pill w-75 py-1 ps-3 my-2'><span className='text-warning'>Date of Incedent..</span></p>
              <p className='btn-danger rounded-pill w-75 py-1 ps-3 my-2'><span className='text-warning'>Time of Incedent..</span></p>
            </div>
            <div className="col-md-6">
                 {/* Success and Error messages */}
                {successMessage && <div className="alert alert-success alert-dismissible fade show mt-3">{successMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>}
                {errorMessage && <div className="alert alert-danger alert-dismissible fade show mt-3">{errorMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

            </div>
          </div>
          </form>
          <h5>Header Columns:</h5>
          <hr />
          <table className="mb-5" width="100%">
            <thead className="thead-dark">
              <tr>
                <th scope="col" className="btn-danger rounded text-center" width="12%">Sequence</th>
                <th scope="col" className="btn-danger rounded text-center" width="30%">Title</th>
                <th scope="col" className="btn-danger rounded text-center">Height<br />(px)</th>
                <th scope="col" className="btn-danger rounded text-center">Width<br />(%)</th>
                <th scope="col" className="btn-danger rounded text-center">Specific Format</th>
                <th scope="col" className="btn-danger rounded text-center">Border</th>
                <th scope="col" className="text-center">
                  <button className="btn btn-success rounded-pill text-center w-100" onClick={handleHeaderAddColumn}>
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {headerColumns && headerColumns.map((column, index) => (
                <ColumnRow
                  key={index}
                  column={column}
                  index={index}
                  handleChange={handleHeaderChange}
                  handleDeleteRow={handleHeaderDeleteRow}
                />
              ))}
            </tbody>
          </table>

        <h5>Boolean Columns:</h5>
         <hr/>
          <table className="" width="100%">
            <thead className="thead-dark">
              <tr>
                <th scope="col" className="btn-danger rounded text-center" width="12%">Sequence</th>
                <th scope="col" className="btn-danger rounded text-center" width="30%">Title</th>
                <th scope="col" className="btn-danger rounded text-center">Item</th>
                <th scope="col" className="btn-danger rounded text-center">Description</th>
                <th scope="col" className="text-center">
                  <button className="btn btn-success rounded-pill text-center w-100" onClick={handleAddBoolColumn}>
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {boolColumns && boolColumns.map((column, index) => (
                <BoolColumnRow
                  key={index}
                  column={column}
                  index={index}
                  handleBoolChange={handleBoolChange}
                  handleBChange={handleBChange}
                  handleDeleteBoolRow={handleDeleteBoolRow}
                  handleAddOption={handleAddOption}
                />
              ))}
            </tbody>
          </table>
          
          <h5>Tabular Columns:</h5>
          <hr />
          <table className="" width="100%">
            <thead className="thead-dark">
              <tr>
                <th scope="col" className="btn-danger rounded text-center" width="12%">Sequence</th>
                <th scope="col" className="btn-danger rounded text-center" width="30%">Title</th>
                <th scope="col" className="btn-danger rounded text-center">Height<br />(px)</th>
                <th scope="col" className="btn-danger rounded text-center">Width<br />(%)</th>
                <th scope="col" className="btn-danger rounded text-center">Specific Format</th>
                <th scope="col" className="btn-danger rounded text-center">Border</th>
                <th scope="col" className="text-center">
                  <button className="btn btn-success rounded-pill text-center w-100" onClick={handleAddColumn}>
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {columns && columns.map((column, index) => (
                <ColumnRow
                  key={index}
                  column={column}
                  index={index}
                  handleChange={handleChange}
                  handleDeleteRow={handleDeleteRow}
                />
              ))}
            </tbody>
          </table>
          <hr />
          <div className="text-center">
            <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handlePreview}>Preview</button>
            <button className="btn btn-danger px-5 m-auto my-2" onClick={handleUpdateReportTemplate}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCustomizeHybrid;
