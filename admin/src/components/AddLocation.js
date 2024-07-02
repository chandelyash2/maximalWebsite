import React, { useState, useEffect } from 'react';
import { ref, get, push, set, remove } from 'firebase/database';
import { database } from '../firebaseconfig';
import { Link } from 'react-router-dom';

function AddLocation() {
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [reportUserAccessPermissions, setReportUserAccessPermissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(''); // State variable for selected userId

  // Fetch users and report templates on component mount
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const locationRef = ref(database, 'location');

    // Fetch users
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersArray = Object.keys(data)
          .filter(key => data[key].type === 'Client')
          .map(key => ({
            id: key,
            ...data[key]
          }));
          setUsers(usersArray);
        } else {
          setErrorMessage('No User Profiles found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching User Profiles: ${error.message}`);
      });

    // Fetch report templates
    get(locationRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const templatesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setLocation(templatesArray);
        } else {
          setErrorMessage('No report templates found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching report templates: ${error.message}`);
      });

  }, []);

  // Function to handle adding new permission
  const addNewLocation = () => {
    // Validate selections
    if (!userId || !newLocation ) {
      alert('Please select User, Type Location');
      return;
    }

    // Find selected user and report template
    const selectedUser = users.find(user => user.id === userId);
  
    // Check if selected user and template exist
    if (!selectedUser || !newLocation) {
      alert('Selected User or Report Template does not exist.');
      return;
    }
  
    // Create new permission object
    const NewLocationobj = {
      email: selectedUser.email, // Replace with appropriate property from your user object
      userId: userId,
      location: newLocation
    };
  
    // Update state with new permission

    setLocation([...location, NewLocationobj]);

  
    // Save to database (assuming 'reportUserAccessPermissions' is your database table)
    const newLocationRef = push(ref(database, 'location'));
    set(newLocationRef, NewLocationobj);
  
    // Clear selection after adding
    setNewLocation('');
  };
  

  const handleDelete = (templateId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this report template?");
    if (!isConfirmed) {
      return; // If user cancels, do nothing
    }
    const templateRef = ref(database, `reportUserAccessPermissions/${templateId}`);
    // Remove the report template from Firebase Realtime Database
    remove(templateRef)
      .then(() => {
        // Filter out the deleted template from the state
        setReportUserAccessPermissions(reportUserAccessPermissions.filter(template => template.id !== templateId));
      })
      .catch((error) => {
        setErrorMessage(`Error deleting report template: ${error.message}`);
      });
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="btn btn-danger mb-4 rounded-pill px-5">Add New Location</h3>
          </div>

          {/* Select User */}
          <div className="row">
            
            <div className='col-md-3'>
                <div className="form-group">
                <label>Select Client:</label>
                <select className="form-control btn-danger" onChange={(e) => setUserId(e.target.value)}>
                  <option value="">Select User:</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.firstName} {user.lastName}, { user.email}</option>
                  ))}
                </select>
              </div>           
            </div>

            <div className='col-md-3'>
                        {/* Select Report Template */}
                    <div className="form-group">
                      <label>Type Location:</label>
                      <input type='text' className="form-control btn-danger" onChange={(e) => setNewLocation(e.target.value)}/>
                      
                        
                    </div>

            </div>
 
            <div className='col-md-3'>
                {/* Add Button */}
                <label>Action:</label><br/>
                <button className="btn btn-success mb-4" onClick={addNewLocation}>Add Location</button>
              
            </div>
          </div>

          {/* Display Existing Permissions */}
          <div>
            <h4>Existing Locations</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Client Full Name</th>
                  <th>Client Email</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {location.map((loc, index) => {
                // Assuming you have a way to find the corresponding user
                const correspondingUser = users.find(user => user.id === loc.userId);

                return (
                  <tr key={index}>
                    <td>{correspondingUser ? correspondingUser.firstName : ''}</td>
                    <td>{loc.email}</td>
                    <td>{loc.location}</td>
                    <td>
                      <button className="btn btn-warning rounded-pill mx-1 text-center" title='Delete' onClick={() => handleDelete(loc.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}

              
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

export default AddLocation;
