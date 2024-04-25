import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, get, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';

const ReportPreview = () => {
  const { reportTempId } = useParams();
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('Document Report');
  const [columns, setColumns] = useState([]);
  const [employeeUserId, setEmployeeUserId] = useState('');
  const [customerUserId, setCustomerUserId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [date, setDate] = useState('');
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
            if(data.type=="Tabular Report")
            {
            setReportName(data.name);
            setReportType(data.type);
            setColumns(data.columns || []); // Ensure columns is always initialized as an array
            setCompanyName(data.companyName);
            setCompanyLocation(data.companyLocation);
            setEmployeeUserId(data.employeeUserId);
            setCustomerUserId(data.customerUserId);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            }
            if(data.type=="Document Report")
            {
              setReportName(data.name);
              setReportType(data.type);
              setColumns(data.columns || []); // Ensure columns is always initialized as an array
              setCompanyName(data.companyName);
              setCompanyLocation(data.companyLocation);
              setEmployeeUserId(data.employeeUserId);
              setCustomerUserId(data.customerUserId);
              setDate(data.date);
            }
          } else {
            setErrorMessage('Report template not found');
          }
        })
        .catch((error) => {
          setErrorMessage(`Error fetching report template: ${error.message}`);
        });
    }
  }, [reportTempId]);

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  const handleGoHome = () => {
    navigate('/home'); // This will navigate back to the previous page
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', height: '680px' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
          </div>
          <div className="text-center">
            <button className="btn w-25 btn-danger text-center m-auto rounded-pill">{reportName}</button>
          </div>
  
          {/* Form inputs */}
          {/* Report Name and Type inputs */}
          {reportType === "Tabular Report" && (
            <div>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyName}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyLocation}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Start Date</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">{startDate}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Start Time</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">06:00 AM</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">End Date</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">{endDate}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">End Time</button>
              <button className="btn w-25 my-1  m-auto rounded-pill text-start ps-5">06:00 PM</button>
  
              {/* Report Columns */}
              <hr />
              <table className="w-100" width="100%">
                <thead className="thead-dark">
                  <tr className="w-100 d-flex justify-content-start">
                    <th width="10%" className='btn rounded-pill text-center d-flex justify-content-center align-items-center'>Rows</th>
                    {columns && columns
                      .filter(column => column.rowcol === "Column" || column.rowcol === "column")
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((column, index) => (
                        <th scope="col" className='btn-danger rounded-pill text-center d-flex justify-content-center align-items-center' width={column.width + "%"} key={index}>
                          {column.title}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {columns && columns
                    .filter(column => column.rowcol === "Row")
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((column, index) => (
                      <tr key={index}>
                        <td  className='btn-danger my-1 rounded-pill text-center' style={{'width':'20%',}}>
                          {column.title}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <hr />
            </div>
          )}
  
          {/* DOCUMENT REPORT SECTIONS */}
          {reportType === "Document Report" && (
            <div>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyName}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyLocation}</button>
              <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Date</button>
              <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{date}</button>
              <hr/>
              {/* Report Columns */}
              {columns && columns
              .filter(column => column.position == "Header")
              .sort((a, b) => a.sequence - b.sequence)
              .map((column, index) => (
                <div key={index} style={{ display: column.width == 100 ? 'block' : 'inline-block' , width: column.width == 100 ? '100%' : '50%' }}>
                  <button className="btn my-1 btn-danger text-center rounded-pill" style={{ width: column.width == 100 ? '25%' : '50%' }}>{column.title}</button>
                  <span className={`my-1 text-start rounded-pill ps-5 ${column.border == "Yes" ? 'border border-1' : ''}`} style={{ display: column.width == 100 ? 'block' : 'inline-block' , width: column.width == 100 ? '100%' : '50%', height: column.height + "px" }}>.....Values.....</span>
                </div>
              ))}
              <hr/>
              {columns && columns
              .filter(column => column.position == "Body")
              .sort((a, b) => a.sequence - b.sequence)
              .map((column, index) => (
                <div key={index} style={{ display: column.width == 100 ? 'block' : 'inline-block' , width: column.width == 100 ? '100%' : '50%' }}>
                  <button className="btn my-1 btn-danger text-center rounded-pill" style={{ width: column.width == 100 ? '25%' : '50%' }}>{column.title}</button>
                  <span className={`my-1 text-start ps-5 ${column.border == "Yes" ? 'border border-1 border-dark' : ''}`} style={{ display: column.width == 100 ? 'block' : 'inline-block' , width: column.width == 100 ? '100%' : '50%', height: column.height + "px" }}>.....Values.....</span>
                </div>
              ))}


            </div>
          )}
  
          <div className='text-center'>
            <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handleGoHome}>Home</button>
            <button className="btn btn-danger px-5 m-auto my-2 me-5" onClick={handleGoBack}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );

}
  
export default ReportPreview;
