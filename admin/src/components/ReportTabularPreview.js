import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, get, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';

const ReportTabularPreview = () => {
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


  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-8 py-4" style={{ color: '#735744', height:'680px' }}>
      <div className="text-center">
        <Link to="/home">
      <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>  </Link>
    
      </div>
      <div className="text-center">
      <p className='pt-2'>Preview Report Template ID: <span className='text-success'><b>{reportTempId}</b></span></p>
      <button className="btn w-25 btn-danger text-center m-auto rounded-pill">{reportName}</button>
      
      </div>
          {/* Form inputs */}
          {/* Report Name and Type inputs */}
        
          
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Name</button> 
            <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyName}</button> 
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Company Location</button> 
            <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{companyLocation}</button> 
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">Start Date</button> 
            <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{startDate}</button> 
            <button className="btn w-25 my-1 btn-danger text-center m-auto rounded-pill">End Date</button> 
            <button className="btn w-75 my-1  m-auto rounded-pill text-start ps-5">{endDate}</button> 
          
         
          {/* Report Columns */}
          <hr/>
          <table className="" width="100%">         
            <thead className="thead-dark">
            <tr >
              <th></th>
            {columns && columns
            .filter(column => column.rowcol === "Column") // Filter columns where rowcol is "Column"
            .sort((a, b) => a.sequence - b.sequence) // Sort columns by sequence
            .map((column, index) => (
            
                <th scope="col" className='btn-danger rounded-pill text-center' width={column.width+"%"} key={index}>
                  {column.title}
                </th>
              
            ))}
          </tr>
          </thead>
          <tbody>
            {columns && columns
              .filter(column => column.rowcol === "row")
              .sort((a, b) => a.sequence - b.sequence) // Sort columns by sequence
              .map((column, index) => (
                <tr key={index}>
                  <td scope="col" className='btn-danger my-1 rounded-pill text-center' width={column.width + "%"}>
                    {column.title}
                  </td>
                </tr>
              ))}
          </tbody>


          </table>
        
          <hr/>
          <div className='text-center'>
          <button className="btn btn-danger px-5 m-auto my-2 me-5" >Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTabularPreview;
