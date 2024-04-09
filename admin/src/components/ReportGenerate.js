import React, { useState, useEffect } from 'react';
import { ref, get, push, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Importing icons
import { useParams } from 'react-router-dom';

const ReportGenerate = () => {
  const { reportName } = useParams();
  const [reportTemplate, setReportTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [reportGeneratedId, setReportGeneratedId] = useState('');

  useEffect(() => {
    const fetchReportTemplate = async () => {
      const reportTemplateRef = ref(database, `reportTemplates/${reportName}`); // Use the selected report name

      try {
        const snapshot = await get(reportTemplateRef);
        if (snapshot.exists()) {
          setReportTemplate(snapshot.val());
        } else {
          setError(reportName+'Report template not found.');
        }
      } catch (error) {
        setError('Error fetching report template.');
        console.error('Error fetching report template:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportTemplate();
  }, [reportName]); // Fetch report template when report name changes

  useEffect(() => {
    if (reportTemplate) {
      const initialRowData = {};
      Object.keys(reportTemplate.columns).forEach(columnName => {
        initialRowData[columnName] = '';
      });
      setReportData([initialRowData]);
    }
  }, [reportTemplate]);

  const handleAddRow = () => {
    setReportData(prevData => {
      const newRowData = {};
      Object.keys(reportTemplate.columns).forEach(columnName => {
        newRowData[columnName] = '';
      });
      return [...prevData, newRowData];
    });
  };

  const handleDeleteRow = index => {
    setReportData(prevData => prevData.filter((_, i) => i !== index));
  };

  const handleSaveReport = async () => {
    const reportGeneratedRef = push(ref(database, 'ReportGenerated'));
    const newReportGeneratedId = reportGeneratedRef.key;

    try {
      await set(ref(database, `ReportGenerated/${newReportGeneratedId}`), {
        reportData
      });
      setReportGeneratedId(newReportGeneratedId);
    } catch (error) {
      console.error('Error saving report data:', error);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row justify-content-center">
        <div className="col-md-8 py-3">
          <h2 className="text-center">View Report</h2>
          {/* Report Details table view */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Report Date</th>
                <th>Customer UserID</th>
                <th>Employee UserID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="date" className="form-control" id="reportDate" />
                </td>
                <td>
                  <input type="text" className="form-control" id="customerUserId" />
                </td>
                <td>
                  <input type="text" className="form-control" id="employeeUserId" />
                </td>
              </tr>
            </tbody>
          </table>
          {/* End of Report Details table view */}
          {/* Main Report Template table view */}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {reportTemplate && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  {/* Render header row with column names */}
                  {Object.values(reportTemplate.columns).map((columnObj, index) => (
                    <th key={index}>{columnObj.name}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render data rows with input boxes */}
                {reportData.map((rowData, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(reportTemplate.columns).map((columnName, columnIndex) => (
                      <td key={columnIndex}>
                        <input
                          type={reportTemplate.columns[columnName].type}
                          className="form-control"
                          value={rowData[columnName]}
                          onChange={e => {
                            const { value } = e.target;
                            setReportData(prevData => {
                              const newData = [...prevData];
                              newData[rowIndex] = { ...newData[rowIndex], [columnName]: value };
                              return newData;
                            });
                          }}
                        />
                      </td>
                    ))}
                    <td>
                    <button className="btn btn-danger" onClick={() => handleDeleteRow(rowIndex)}>
                        <FaTrash />
                      </button>
                      {rowIndex === reportData.length - 1 && (
                        <button className="btn btn-primary mr-2 ms-2 " onClick={handleAddRow}>
                          <FaPlus />
                        </button>
                      )}
                   
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* End of Main Report Template table view */}
          {/* Save button */}
          <div className="text-center">
            <button className="btn btn-success" onClick={handleSaveReport}>Save Report</button>
          </div>
          {/* End of Save button */}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerate;
