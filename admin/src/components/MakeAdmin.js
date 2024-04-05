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
    <div>
      <h2>Set User Admin Privileges</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
          />
        </label><br/>
        <label>
          Action:
          <select value={action} onChange={handleActionChange}>
            <option value="grant">Grant</option>
            <option value="revoke">Revoke</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default MakeAdmin;
