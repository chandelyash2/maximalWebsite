import React, { useState } from 'react';
import axios from 'axios';

const MakeAdmin = () => {
  const [userId, setUserId] = useState('');
  const [action, setAction] = useState('grant'); // Default to grant admin privileges
  const [message, setMessage] = useState('');

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://us-central1-maximal-security-services.cloudfunctions.net/makeAdmin', { userId, action });
      setMessage(`User admin privileges ${action === 'grant' ? 'granted' : 'revoked'} successfully.`);
    } catch (error) {
      console.error('Error setting user admin privileges:', error);
      setMessage('Failed to set user admin privileges. Please try again later.');
    }
  };

  return (
    <div className='row justify-content-center'>
    <div className='col-md-6 my-4'>
      <h2>Set User Admin Privileges</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            className="form-control"
            value={userId}
            onChange={handleUserIdChange}
          />
        </div>
        <div className="form-group">
          <label>Action:</label>
          <select
            className="form-control"
            value={action}
            onChange={handleActionChange}
          >
            <option value="grant">Grant</option>
            <option value="revoke">Revoke</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary my-5 w-50">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  </div>
  );
};

export default MakeAdmin;
