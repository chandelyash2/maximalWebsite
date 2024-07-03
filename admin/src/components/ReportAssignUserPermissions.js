import React, { useState, useEffect } from 'react';
import { ref, get, push, set, remove } from 'firebase/database';
import { database } from '../firebaseconfig';
import { Link } from 'react-router-dom';

function ReportAssignUserPermissions() {
  const [users, setUsers] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [accessType, setAccessType] = useState('');
  const [reportUserAccessPermissions, setReportUserAccessPermissions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(''); // State variable for selected userId
  const [reportTemplateId, setReportTemplateId] = useState(''); // State variable for selected reportTemplateId
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);



  // Fetch users and report templates on component mount
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const reportTemplatesRef = ref(database, 'reportTemplates');
    const reportUserAccessPermissionsRef = ref(database, 'reportUserAccessPermissions');
    
    const compareBy = (key) => {
      return function(a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      };
    }
  
    const sortList = (key) => {
      let arrayCopy = [...this.state.users];
      arrayCopy.sort(this.compareBy(key));
      this.setState({ users: arrayCopy });
    }

    // Fetch users
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setUsers(usersArray);
          sortList(users.firstName)
        } else {
          setErrorMessage('No User Profiles found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching User Profiles: ${error.message}`);
      });

    // Fetch report templates
    get(reportTemplatesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const templatesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setReportTemplates(templatesArray);
        } else {
          setErrorMessage('No report templates found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching report templates: ${error.message}`);
      });

    // Fetch report user access permissions
    get(reportUserAccessPermissionsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const permissionsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setReportUserAccessPermissions(permissionsArray);
        } else {
          setErrorMessage('No report user access permissions found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching report user access permissions: ${error.message}`);
      });

  }, []);



  // Function to handle adding new permission
  const addPermission = () => {
    // Validate selections
    if (!userId || !reportTemplateId || !accessType) {
      alert('Please select User, Report Template, and Access Type.');
      return;
    }

    // Find selected user and report template
    const selectedUser = users.find(user => user.id === userId);
    const selectedTemplate = reportTemplates.find(template => template.id === reportTemplateId);
  
    // Check if selected user and template exist
    if (!selectedUser || !selectedTemplate) {
      alert('Selected User or Report Template does not exist.');
      return;
    }
  
    // Create new permission object
    const newPermission = {
      email: selectedUser.email, // Replace with appropriate property from your user object
      userId: userId,
      reportTemplateName: selectedTemplate.name, // Replace with appropriate property from your template object
      reportTemplateId: reportTemplateId,
      accessType: accessType,
      userType: selectedUser.type
    };
  
    // Update state with new permission
    setReportUserAccessPermissions([...reportUserAccessPermissions, newPermission]);
  
    // Save to database (assuming 'reportUserAccessPermissions' is your database table)
    const newPermissionRef = push(ref(database, 'reportUserAccessPermissions'));
    set(newPermissionRef, newPermission);
  
    // Clear selection after adding
    setAccessType('');
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

  // const handleSearchChange = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);
  //   if (term.length === 0) {
  //     setFilteredUsers([]);
  //   } else {
  //     const filtered = users.filter(user =>
  //       (user.firstName && user.firstName.toLowerCase().includes(term)) ||
  //       (user.lastName && user.lastName.toLowerCase().includes(term)) ||
  //       (user.company && user.company.toLowerCase().includes(term)) ||
  //       (user.address && user.address.toLowerCase().includes(term))
  //     );
  //     setFilteredUsers(filtered);
  //   }
  // };

 


  
  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="ol-xl-10 col-lg-12 py-4 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="btn btn-danger mb-4 rounded-pill px-5">Assign Report</h3>
          </div>

          {/* Select User */}
          <div className="row">
            <div className='col-md-3'>
              <div className="form-group">
                <label htmlFor="userSearch">Search for User:</label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="userSearch"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Type to search..."
                  list="userResults"
                />
                {searchTerm.length > 0 && (
                  <datalist id="userResults">
                    {filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <option value={`${user.firstName} ${user.lastName}`} />
                        <option value={user.company || user.address} />
                      </React.Fragment>
                    ))}
                  </datalist>
                )} */}
                <select className="form-control btn-danger" onChange={(e) => setUserId(e.target.value)}>
                  <option value="">Select User:</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.firstName+" "+user.lastName+" ("+user.email+")"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='col-md-3'>
              {/* Select Report Template */}
              <div className="form-group">
                <label>Select Report Template:</label>
                <select className="form-control btn-danger" onChange={(e) => setReportTemplateId(e.target.value)}>
                  <option value="">Select Report Template</option>
                  {reportTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='col-md-3'>
              {/* Select Access Type */}
              <div className="form-group">
                <label>Select Access Type:</label>
                <select className="form-control btn-danger" value={accessType} onChange={(e) => setAccessType(e.target.value)}>
                  <option value="">Select Access Type</option>
                  <option value="Populate">Populate</option>
                  <option value="View-Limited">View-Limited</option>
                  <option value="View-Full">View-Full</option>
                  <option value="Edit">Edit</option>
                </select>
              </div>
            </div>

            <div className='col-md-3'>
              {/* Add Button */}
              <label>Action:</label><br/>
              <button className="btn btn-success mb-4" onClick={addPermission}>Add Permission</button>
            </div>
          </div>

          {/* Display Existing Permissions */}
          <div>
            <h4>Existing Permissions</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>User Name & Add.</th>
                  <th>User Role</th>
                  <th>Report Template</th>
                  <th>Client Name & Location</th>
                  <th>Access</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reportUserAccessPermissions.map((permission, index) => 
                 (
                  <tr key={index}>
                    <td><b>{users.find(user => user.id === permission.userId)?.firstName+ " "+users.find(user => user.id === permission.userId)?.lastName}</b>
                    <br/>{users.find(user => user.id === permission.userId)?.streetAddress} {users.find(user => user.id === permission.userId)?.city}<br/>
                    <span className='text-secondary'>{users.find(user => user.id === permission.userId)?.email}</span>
                    </td>
                    <td>{permission.userType}</td>
                    <td>{permission.reportTemplateName}</td><td>
                      <b>
                    {reportTemplates.find(temp => temp.id === permission.reportTemplateId)?.companyName}</b>
                    <br/>
                    {reportTemplates.find(temp => temp.id === permission.reportTemplateId)?.companyLocation}

                    </td>
                    <td>{permission.accessType}</td>
                    <td>
                      <button className="btn btn-warning rounded-pill mx-1 text-center" title='Delete' onClick={() => handleDelete(permission.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                 )
                )}
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

export default ReportAssignUserPermissions;
