import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../../firebaseconfig';
import ColumnRow from './ColumnRow';
import BoolColumnRow from './BoolColumnRow';
import DocumentColumnRow from './DocumentColumnRow';

const ReportCustomizeHybrid = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();

  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Hybrid Report');
  const [tables, setTables] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddTableModal, setShowAddTableModal] = useState(false);

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

  const handleAddTable = (type) => {
    setTables((prevTables) => [
      ...prevTables,
      {
        id: Date.now(),
        type: type,
        name: '',
        columns: [],
      },
    ]);
    setShowAddTableModal(false);
  };

  const handleTableChange = (index, field, value) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[index][field] = value;
      return updatedTables;
    });
  };

  const handleAddColumn = (tableIndex) => {
    const updatedTables = [...tables];
    const newColumn = {};

    switch (updatedTables[tableIndex].tabletype) {
      case 'Document':
        newColumn={sequence: '', position: 'Header', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No' };
        break;
      case 'Toggle':
        newColumn= { sequence: '', title: 'Title', item: '', description: 'No', options: ['test'] };
        break;
      case 'Tabular':
        newColumn={ sequence: '', position: 'Header', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No' };
        break;
      default:
        break;
    }
    updatedTables[tableIndex].columns.push(newColumn);
    setTables(updatedTables);

  };

  const handleChange = (index, fieldName, value) => {
    const updatedTables = [...tables];
    updatedTables[index].columns = updatedTables[index].columns.map((column, idx) => {
      if (idx === index) {
        return { ...column, [fieldName]: value };
      }
      return column;
    });
    setTables(updatedTables);
  };
  
  
  const handleDeleteRow = (tableIndex, columnIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(updatedTables);
  };

  const handleUpdateReportTemplate = (e) => {
    e.preventDefault();
    const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
    const updatedReportTemplate = {
      name: reportName,
      type: reportType,
      tables: tables,
      companyName: companyName,
      companyLocation: companyLocation,
    };

    set(reportTemplateRef, updatedReportTemplate)
      .then(() => {
        setSuccessMessage('Report template updated successfully');
      })
      .catch((error) => {
        setErrorMessage(`Error updating report template: ${error.message}`);
      });
  };

  const handleAddOption = (tableIndex, columnIndex, newOption) => {
    setTables((prevTables) => {
      const updatedTables = prevTables.map((table, tIndex) => {
        if (tIndex !== tableIndex) return table;
  
        const updatedColumns = table.columns.map((column, cIndex) => {
          if (cIndex !== columnIndex) return column;
  
          const options = column.options || []; // Initialize options array if not already initialized
          return {
            ...column,
            options: [...options, newOption]
          };
        });
  
        return {
          ...table,
          columns: updatedColumns
        };
      });
  
      return updatedTables;
    });
  };
  

  const handlePreview = () => {
    const reportData = { tables };
    navigate(`/previewReport/${reportTempId}`, { state: reportData });
  };

  const handleTableNameChange = (tableIndex, newName) => {
    setTables((prevTables) => {
      const updatedTables = [...prevTables];
      updatedTables[tableIndex].name = newName;
      return updatedTables;
    });
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
                  className="form-control btn-danger rounded-pill w-75 my-2"
                  id="companyNameID"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name..."
                />
                <input
                  type="text"
                  className="form-control btn-danger rounded-pill w-75 my-2"
                  id="companyLocationID"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  placeholder="Company Location..."
                />
                <p className='btn-danger rounded-pill w-75 py-1 ps-3 my-2'><span className='text-warning'>Date of Incident..</span></p>
                <p className='btn-danger rounded-pill w-75 py-1 ps-3 my-2'><span className='text-warning'>Time of Incident..</span></p>
              </div>
              <div className="col-md-6">
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show mt-3">
                    {successMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger alert-dismissible fade show mt-3">
                    {errorMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
              </div>
            </div>
          </form>
          {tables.map((table, tableIndex) => (
            <div key={table.id}>
              <h5>{`Table ${tableIndex + 1}: ${table.name} (${table.type})`}</h5>
              <hr />
              <table className="mb-5" width="100%">
                <thead className="thead-dark">
                  {table.type === 'Document' && (
                    <tr>
                      <th scope="col" className="btn-danger rounded text-center">Sequence</th>
                      <th scope="col" className="btn-danger rounded text-center">Title</th>
                      <th scope="col" className="btn-danger rounded text-center">Height</th>
                      <th scope="col" className="btn-danger rounded text-center">Width</th>
                      <th scope="col" className="btn-danger rounded text-center">Specific Format</th>
                      <th scope="col" className="btn-danger rounded text-center">Border</th>
                      <th scope="col" className="rounded text-center">
                        <button className="btn btn-success rounded-pill text-center w-100" onClick={() => handleAddColumn(tableIndex)}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </th>
                    </tr>
                  )}
                  {table.type === 'Toggle' && (
                    <tr>
                      <th scope="col" className="btn-danger rounded text-center" width="12%">Sequence</th>
                      <th scope="col" className="btn-danger rounded text-center" width="30%">Title</th>
                      <th scope="col" className="btn-danger rounded text-center">Item</th>
                      <th scope="col" className="btn-danger rounded text-center">Description</th>
                      <th scope="col" className="rounded text-center">
                        <button className="btn btn-success rounded-pill text-center w-100" onClick={() => handleAddColumn(tableIndex)}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </th>
                    </tr>
                  )}
                  {table.type === 'Tabular' && (
                    <tr>
                      <th scope="col" className="btn-danger rounded text-center" width="12%">Sequence</th>
                      <th scope="col" className="btn-danger rounded text-center" width="30%">Title</th>
                      <th scope="col" className="btn-danger rounded text-center">Height<br />(px)</th>
                      <th scope="col" className="btn-danger rounded text-center">Width<br />(%)</th>
                      <th scope="col" className="btn-danger rounded text-center">Specific Format</th>
                      <th scope="col" className="btn-danger rounded text-center">Border</th>
                      <th scope="col" className="text-center">
                        <button className="btn btn-success rounded-pill text-center w-100" onClick={() => handleAddColumn(tableIndex)}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {table.columns.map((column, columnIndex) => {
                    if (table.type === 'Document') {
                      return (
                        <DocumentColumnRow
                          key={columnIndex}
                          column={column}
                          index={columnIndex}
                          handleChange={(field, value) => handleChange(tableIndex, columnIndex, field, value)}
                          handleDeleteRow={() => handleDeleteRow(tableIndex, columnIndex)}
                        />
                      );
                    } else if (table.type === 'Toggle') {
                      return (
                        <BoolColumnRow
                          key={columnIndex}
                          tableIndex={tableIndex}
                          column={column}
                          columnIndex={columnIndex}
                          handleChange={handleChange}
                          handleDeleteRow={handleDeleteRow}
                          handleAddOption={handleAddOption}
                        />
                      );
                    } else {
                      return (
                        <ColumnRow
                          key={columnIndex}
                          column={column}
                          index={columnIndex}
                          handleChange={(field, value) => handleChange(tableIndex, columnIndex, field, value)}
                          handleDeleteRow={() => handleDeleteRow(tableIndex, columnIndex)}
                        />
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          ))}
          <hr />
          <div className="text-center">
            <button className="btn btn-danger px-5 m-auto my-2" onClick={() => setShowAddTableModal(true)}>Add Table</button>
            <button className="btn btn-danger px-5 m-auto my-2 mx-5" onClick={handlePreview}>Preview</button>
            <button className="btn btn-danger px-5 m-auto my-2" onClick={handleUpdateReportTemplate}>Save</button>
          </div>
        </div>
      </div>

      {showAddTableModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Table Type</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddTableModal(false)}></button>
              </div>
              <div className="modal-body">
                <button className="btn btn-danger w-100 mb-2" onClick={() => handleAddTable('Document')}>Document Table</button>
                <button className="btn btn-danger w-100 mb-2" onClick={() => handleAddTable('Toggle')}>Toggle Table</button>
                <button className="btn btn-danger w-100 mb-2" onClick={() => handleAddTable('Tabular')}>Tabular Table</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShowAddTableModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCustomizeHybrid;
