import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../../firebaseconfig';
import Tabular from './Tabular';
import Document from './Document';
import { Modal } from 'react-bootstrap';

const ReportCustomize = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [tables, setTables] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // Initially hidden
  const [tableIndex, setTableIndex] = useState('');
  const [columnIndex, setColumnIndex] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (reportTempId) {
      const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setReportName(data.name);
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

    const usersRef = ref(database, 'users');
    get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const templatesArray = Object.keys(data)
        .filter(key => data[key].type === 'Client')
        .map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(templatesArray);
      } else {
        setErrorMessage('No User Profiles found');
      }
    })
    .catch((error) => {
      setErrorMessage(`Error fetching User Profiles: ${error.message}`);
    });


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

  const handleDeleteTable = (tableIndex) => {
    const updatedTables = [...tables];
    updatedTables.splice(tableIndex, 1);
    setTables(updatedTables);
  };

  const handleTableNameChange = (tableIndex, value) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].name = value;
    setTables(updatedTables);
  };


  const handleAddColumn = (tableIndex) => {
    const updatedTables = [...tables];
    const newColumn = {};
  
    switch (updatedTables[tableIndex].type) { // Assuming table type is stored in `type`
      case 'Document':
        Object.assign(newColumn, { sequence: '', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No' });
        break;
      case 'Tabular':
        Object.assign(newColumn, { sequence: '', title: 'Title', height: '15', width: '10', format: 'Text', border: 'No', fixed: [] });
        break;
      default:
        return; // Do nothing if type is not recognized
    }
  
    updatedTables[tableIndex].columns.push(newColumn);
    setTables(updatedTables);
  };
  
  const handleAddfixedColumn =  (tableIndex, columnIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns[columnIndex].fixed.push('');
    setTables(updatedTables);
  }

  const handleChange = (tableIndex, columnIndex, fieldName, value) => {

    if (value === undefined) return; 

    const updatedTables = [...tables];
    updatedTables[tableIndex].columns[columnIndex][fieldName] = value;
    setTables(updatedTables);

    if(fieldName=="format" && value=="fixed value")
      {
        setTableIndex(tableIndex);
        setColumnIndex(columnIndex);
        setShowModal(true);
      }

  };
  
  const handleChangefix = (tableIndex, columnIndex, value, fixedIndex) => {

    if (value === undefined) return; // Avoid updating with undefined value

    const updatedTables = [...tables];
    updatedTables[tableIndex].columns[columnIndex].fixed[fixedIndex] = value;
    setTables(updatedTables);
  };

  const handleDeleteRow = (tableIndex, columnIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(updatedTables);
  };

  const handleDeleteFixedRow = (tableIndex, columnIndex, fixedIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns[columnIndex].fixed.splice(fixedIndex, 1);
    setTables(updatedTables);
  };

  const handleUpdateReportTemplate = (e) => {
    // e.preventDefault();
    const reportTemplateRef = ref(database, `reportTemplates/${reportTempId}`);
    const updatedReportTemplate = {
      name: reportName,
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
    handleUpdateReportTemplate();
    const reportData = { tables };
    navigate(`/ReportPreview/${reportTempId}`, { state: reportData });
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4  px-5">
                <h3>ADMINISTRATOR PORTAL</h3>
              </button>
            </Link>
          </div>
          <div className="text-center">
            <input
              type="text"
              className="form-control w-25 btn-danger text-center m-auto "
              id="reportName"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder='Report Name....'
            />
            <button className="btn btn-success px-5 m-auto my-2 mx-5" onClick={handlePreview}><i class='bi bi-printer'></i></button>
                   
          </div>
          <form className="mb-4">
            <div className="form-group row">
              <div className="col-md-6">
                <select 
                  className="form-control btn-danger  w-75 my-2"
                  id="companyNameID"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name..."
                >
                 <option value="">Select a company</option>
                    {users.map((user, index) => (
                      <option key={index} value={user.company}>{user.company}</option>
                    ))}
                </select>
                <select 
                  className="form-control btn-danger  w-75 my-2"
                  id="companyLocationID"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  placeholder="Company Location..."
                >
                    <option value="">Select a Location</option>
                    {users.map((user, index) => (
                      <option key={index} value={user.
                        streetAddress}>{user.
                          streetAddress}</option>
                    ))}
                </select>
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
              <div className="d-flex justify-content-start align-items-center   border border-light border-2 p-2 mb-3">
                
              <h5 className='w-25 text-center'>{`Table ${tableIndex + 1}: (${table.type})`}</h5>
              <input
                    type="text"
                    className="form-control btn-danger  my-1 w-25 mx-5"
                    value={table.name}
                    onChange={(e) => handleTableNameChange(tableIndex, e.target.value)}
                    placeholder="Table Name"
                    title='Table Name'
                  />
                 
                   <button className="btn btn-warning  " onClick={() => handleDeleteTable(tableIndex)} title={`Delete Table ${table.name}`}>
                  <i className="bi bi-trash"></i>
                </button>
                </div>
              <table className="mb-5" width="100%">
                <thead className="thead-dark">
                  {table.type === 'Document' && (
                    <tr>
                      <th scope="col" className="btn-danger text-center" width="12%">Sequence</th>
                      <th scope="col" className="btn-danger text-center" width="30%">Title</th>
                      <th scope="col" className="btn-danger text-center">Height<br />(px)</th>
                      <th scope="col" className="btn-danger text-center" width="10%">Width<br />(%)</th>
                      <th scope="col" className="btn-danger text-center">Specific Format</th>
                      <th scope="col" className="btn-danger text-center">Border</th>
                      <th scope="col" className="  text-center">
                        <button className="btn btn-success   text-center w-100" onClick={() => handleAddColumn(tableIndex)}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </th>
                    </tr>
                  )}
                  {table.type === 'Tabular' && (
                    <tr>
                      <th scope="col" className="btn-danger  text-center" width="12%">Sequence</th>
                      <th scope="col" className="btn-danger  text-center" width="30%">Title</th>
                      <th scope="col" className="btn-danger  text-center">Height<br />(px)</th>
                      <th scope="col" className="btn-danger  text-center">Width<br />(%)</th>
                      <th scope="col" className="btn-danger  text-center">Specific Format</th>
                      <th scope="col" className="btn-danger  text-center">Border</th>
                      <th scope="col" className="text-center">
                        <button className="btn btn-success  text-center w-100" onClick={() => handleAddColumn(tableIndex)}>
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
                        <Document
                          tableIndex={tableIndex}
                          columnIndex={columnIndex}
                          column={column}
                          index={columnIndex}
                          handleChange={handleChange}
                          handleDeleteRow={() => handleDeleteRow(tableIndex, columnIndex)}
                        />
                      );
                    } else {
                      return (
                        <Tabular
                          tableIndex={tableIndex}
                          columnIndex={columnIndex}
                          column={column}
                          handleChange={handleChange}
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
                <button className="btn btn-danger w-100 mb-2" onClick={() => handleAddTable('Tabular')}>Tabular Table</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShowAddTableModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

{showModal && (
  <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-md">
    <Modal.Header closeButton>
      <Modal.Title>Fixed Value: {tables[tableIndex]?.name} :: {tables[tableIndex]?.columns[columnIndex]?.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <table className='table table-borderless'>
        <thead>
          <tr>
            <th className='text-center'>Items</th>
            <th scope="col" className="text-center">
            <button className="btn btn-success w-100" onClick={() => handleAddfixedColumn(tableIndex, columnIndex)}>
              <i className="bi bi-plus-circle"></i>
            </button>
          </th>

          </tr>
        </thead>
        <tbody>
          {tables[tableIndex]?.columns[columnIndex]?.fixed?.map((fix, fixedIndex) => (
            <tr key={fixedIndex}>
              <td>
                <input
                  className="form-control btn-danger text-center w-100"
                  type="text"
                  value={fix} //fix.item
                  onChange={(e) => handleChangefix(tableIndex, columnIndex, e.target.value, fixedIndex)}
                  size="20"
                />
              </td>
              <td className='text-center'>
                <button
                  className="btn btn-warning text-center w-100"
                  onClick={() => handleDeleteFixedRow(tableIndex, columnIndex, fixedIndex)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal.Body>
    <Modal.Footer>
      <button className="btn btn-secondary" onClick={handleCloseModal}>
        Close
      </button>
    </Modal.Footer>
  </Modal>
)};


</div>
  );
};

export default ReportCustomize;
