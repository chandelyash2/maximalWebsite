import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database'; 
import { database } from '../firebaseconfig';

const UserAccess = () => {
  const { userId } = useParams();
  let navigate = useNavigate();

  const [userData, setUserData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userId) {
      const reportTemplateRef = ref(database, `users/${userId}`);
      get(reportTemplateRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
          } else {
            setErrorMessage('Report template not found');
          }
        })
        .catch((error) => {
          setErrorMessage(`Error fetching report template: ${error.message}`);
        });
    }
  }, [userId]);

  const handleChange = (field, value) => {
    userData[field]= value;
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
            <Link to="/UserList">
            <h3 className="btn btn-danger mb-4 rounded-pill px-5 ">Assign/Edit User UserAccess</h3>
            </Link>
          </div>
          <div className="text-center">
            <table className='table'>
                <tr>
                <th className='btn-danger rounded-pill'>User Type</th>
                <th className='btn-danger rounded-pill'>User Email</th>
                <th className='btn-danger rounded-pill'>Full Name</th>
                <th className='btn-danger rounded-pill'>Company Name</th>
                <th className='btn-danger rounded-pill'>Location</th>
                </tr>
                <tr>
                    <td>
                    <select
                        className="form-control btn-danger rounded my-1 text-center w-100"
                        value={userData.type}
                        onChange={(e) => handleChange('type', e.target.value)} >
                        <option value="Client">Client</option>
                        <option value="Security">Security</option>
                        <option value="Management">Management</option>
                        <option value="Administrator">Administrator</option>
                    </select>
                    </td>
                    <td>{userData.email}</td>
                    <td>{userData.name} {userData.lname}</td>
                    <td>{userData.company}</td>
                    <td>{userData.companyAdress}</td>
                </tr>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserAccess;
