import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database'; 
import { database } from '../firebaseconfig';
import ToggleButton from './ToggleButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const UserAccess = () => {
  const { userId } = useParams();
  let navigate = useNavigate();  
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const applicationtypes = ['Community Watch', 'Report', 'Checkpoint Tour','Payroll','Attendance'];
  const viewAccess = ['Limited View Access', 'Full View Access', 'Edit Access'];
  const [reportTemplates, setReportTemplates] = useState([]);

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

  useEffect(() => {
    const reportTemplatesRef = ref(database, 'reportTemplates');
    get(reportTemplatesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const reportTemplateArray = Object.keys(data).map(key => ({
            id: key,
            name: data[key].name,
          }));
          setReportTemplates(reportTemplateArray);
        } else {
          setErrorMessage('No report templates found');
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching report templates: ${error.message}`);
      });
  }, []);

  const handleChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  return (
    <div className='container-fluid' style={{ overflowY: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 py-4" style={{ color: '#735744', maxHeight: '680px', overflowY: 'auto' }}>
          <div className="text-center">
            <Link to="/home">
              <button className="btn btn-danger mb-4 rounded-pill px-5 ">
                <h3>ADMINISTRATOR PORTAL</h3>
              </button>
            </Link>
          </div>
          <div className="text-center">
            <Link to="/UserList">
              <h3 className="btn btn-danger mb-4 rounded-pill px-5 ">Assign/Edit User UserAccess</h3>
            </Link>
          </div>
          <div className="text-center">
            <table className='table'>
              <thead>
                <tr>
                  <th className='btn-danger rounded-pill'>User Type</th>
                  <th className='btn-danger rounded-pill'>User Email</th>
                  <th className='btn-danger rounded-pill'>Full Name</th>
                  <th className='btn-danger rounded-pill'>Company Name</th>
                  <th className='btn-danger rounded-pill'>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select
                      className="form-control btn-danger rounded my-1 text-center w-100"
                      value={userData.type || ''}
                      onChange={(e) => handleChange('type', e.target.value)}
                    >
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
              </tbody>
            </table>
          </div>

          <div className="accordion" id="accordionLocations">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingAccess">
                <button className="accordion-button accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAccess" aria-expanded="false" aria-controls="collapseAccess">
                  View Access
                </button>
              </h2>
              <div id="collapseAccess" className="accordion-collapse collapse" aria-labelledby="headingAccess" data-bs-parent="#accordionLocations">
                <div className="accordion-body">
                  <div className="d-flex flex-wrap">
                    {viewAccess.map((item) => (
                      <div key={item} className="m-2">
                        <ToggleButton permission="ApplicationType" name={item} reportid={item} userId={userId} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingReports">
                <button className="accordion-button accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseReports" aria-expanded="false" aria-controls="collapseReports">
                  Report Templates
                </button>
              </h2>
              <div id="collapseReports" className="accordion-collapse collapse" aria-labelledby="headingReports" data-bs-parent="#accordionLocations">
                <div className="accordion-body">
                  <div className="d-flex flex-wrap">
                    {reportTemplates.map((reportTemplate) => (
                      <div key={reportTemplate.id} className="m-2">
                        <ToggleButton permission="Report" name={reportTemplate.name} reportid={reportTemplate.id} userId={userId} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingApplicationTypes">
                <button className="accordion-button accordion-button1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseApplicationTypes" aria-expanded="false" aria-controls="collapseApplicationTypes">
                  Application Type
                </button>
              </h2>
              <div id="collapseApplicationTypes" className="accordion-collapse collapse" aria-labelledby="headingApplicationTypes" data-bs-parent="#accordionLocations">
                <div className="accordion-body">
                  <div className="d-flex flex-wrap">
                    {applicationtypes.map((item) => (
                      <div key={item} className="m-2">
                        <ToggleButton permission="ApplicationType" name={item} reportid={item} userId={userId} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserAccess;
