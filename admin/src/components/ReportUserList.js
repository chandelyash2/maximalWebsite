import React, { useState, useEffect } from 'react';
import { ref, get, remove, push, set } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import { Link } from 'react-router-dom';

function ReportUserList() {
  const [users, setusers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [selectedCompanyLocation, setSelectedCompanyLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const usersref = ref(database, 'users');

    // Fetch data from Firebase Realtime Database
    get(usersref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the object of objects into an array of objects
          const templatesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setusers(templatesArray);
        } else {
          setErrorMessage('No User Profiles found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching User Profiles: ${error.message}`);
      });

  }, []); // Empty dependency array ensures that the effect runs only once on component mount

  // Filtered report templates based on selected options
  const filteredUsers = users.filter(template =>
    (!selectedName || template.name === selectedName) &&
    (!selectedCompanyName || template.company === selectedCompanyName) &&
    (!selectedCompanyLocation || template.companyAdress === selectedCompanyLocation)
  );

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center" >
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
         
          </div>
          <div className="text-center">
          <h3 className="btn btn-danger mb-4 rounded-pill px-5">User List</h3>
          </div>
          {/* Display select options for reportName, companyName, and companyLocation */}
          {/* <div className="mb-3">
            <select id="reportName" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
              <option value="">Choose Name...</option>
              {[...new Set(users.map(template => template.name))].map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <select id="companyName" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)}>
              <option value="">Choose Company Name...</option>
              {[...new Set(users.map(template => template.company))].map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <select id="companyLocation" className="form-select btn-danger rounded-pill my-1 text-center w-25" value={selectedCompanyLocation} onChange={(e) => setSelectedCompanyLocation(e.target.value)}>
              <option value="">Choose Location...</option>
              {[...new Set(users.map(template => template.companyAdress))].map((companyAdress, index) => (
                <option key={index} value={companyAdress}>{companyAdress}</option>
              ))}
            </select>
          </div> */}

          {/* Display filtered report templates in a Bootstrap table */}
          <div className="table-responsive">
            <table className='w-100 table-bordered'>
              <thead>
                <tr>
                  {/* <th className='btn-danger rounded text-center'>ID</th> */}
                  <th className='btn-danger rounded text-center'>User Type</th>
                  <th className='btn-danger rounded text-center'>First Name</th>
                  <th className='btn-danger rounded text-center'>Last Name</th>
                  <th className='btn-danger rounded text-center'>Email</th>
                  <th className='btn-danger rounded text-center'>Company Name</th>
                  <th className='btn-danger rounded text-center'>Company Address</th>
                  <th className='btn-danger rounded text-center'>Action</th>
                  {/* Add additional table headers as needed */}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(template => (
                  <tr key={template.id} className=''>
                    {/* <td className='text-center'><small>{template.id}</small></td> */}
                    <td className='text-center'>{template.type}</td>
                    <td className='text-center'>{template.name}</td>
                    <td className='text-center'>{template.lname}</td>
                    <td className='text-start ps-2'>{template.email}</td>
                    <td className='text-center'>{template.company}</td>
                    <td className='text-center'>{template.companyAdress}</td>
                    <td className='text-center d-flex flex-columns justify-content-center p-2'> 
                    <Link to={`/UserAccess/${template.id}`} className="btn btn-danger rounded-pill text-center" title='User Permission'>
                       User Permission</Link>
                    </td>
                    {/* Add additional table cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Display error message if any */}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default ReportUserList;
