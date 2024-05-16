// UserList.js
import React, { useState, useEffect, useMemo } from 'react';
import { ref, get } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import { Link } from 'react-router-dom';
import CustomFilter from './CustomFilter';
import { useTable, useFilters } from 'react-table';

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedCompanyNames, setSelectedCompanyNames] = useState([]);
  const [selectedCompanyLocations, setSelectedCompanyLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const usersRef = ref(database, 'users');

    // Fetch data from Firebase Realtime Database
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the object of objects into an array of objects
          const templatesArray = Object.keys(data).map(key => ({
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
  }, []); // Empty dependency array ensures that the effect runs only once on component mount

  const nameOptions = useMemo(() => {
    const options = new Set();
    users.forEach(user => {
      options.add(user.name);
    });
    return [...options].map(option => ({ value: option, label: option }));
  }, [users]);

  const companyNameOptions = useMemo(() => {
    const options = new Set();
    users.forEach(user => {
      options.add(user.company);
    });
    return [...options].map(option => ({ value: option, label: option }));
  }, [users]);

  const companyLocationOptions = useMemo(() => {
    const options = new Set();
    users.forEach(user => {
      options.add(user.companyAdress);
    });
    return [...options].map(option => ({ value: option, label: option }));
  }, [users]);

  const filteredUsers = users.filter(user =>
    (!selectedNames.length || selectedNames.some(option => option.value === user.name)) &&
    (!selectedCompanyNames.length || selectedCompanyNames.some(option => option.value === user.company)) &&
    (!selectedCompanyLocations.length || selectedCompanyLocations.some(option => option.value === user.companyAdress))
  );

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', height: '680px' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5"><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="btn btn-danger mb-4 rounded-pill px-5">User List</h3>
          </div>

          <div className="mb-4">
            <CustomFilter
              options={nameOptions}
              value={selectedNames}
              onChange={setSelectedNames}
              searchPlaceholder="Search by name..."
            />
            <CustomFilter
              options={companyNameOptions}
              value={selectedCompanyNames}
              onChange={setSelectedCompanyNames}
              searchPlaceholder="Search by company name..."
            />
            <CustomFilter
              options={companyLocationOptions}
              value={selectedCompanyLocations}
              onChange={setSelectedCompanyLocations}
              searchPlaceholder="Search by company address..."
            />
          </div>

          {/* Display filtered report templates in a Bootstrap table */}
          <div className="table-responsive">
            <table className='w-100 table-bordered'>
              <thead>
                <tr>
                  <th className='btn-danger rounded text-center'>User Type</th>
                  <th className='btn-danger rounded text-center'>First Name</th>
                  <th className='btn-danger rounded text-center'>Last Name</th>
                  <th className='btn-danger rounded text-center'>Email</th>
                  <th className='btn-danger rounded text-center'>Company Name</th>
                  <th className='btn-danger rounded text-center'>Company Address</th>
                  <th className='btn-danger rounded text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className=''>
                    <td className='text-center'>{user.type}</td>
                    <td className='text-center'>{user.name}</td>
                    <td className='text-center'>{user.lname}</td>
                    <td className='text-start ps-2'>{user.email}</td>
                    <td className='text-center'>{user.company}</td>
                    <td className='text-center'>{user.companyAdress}</td>
                    <td className='text-center d-flex flex-columns justify-content-center p-2'>
                      <Link to={`/UserAccess/${user.id}`} className="btn btn-danger rounded-pill text-center" title='User Permission'>
                        User Permission
                      </Link>
                    </td>
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

export default UserList;
