import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseconfig'; // Import the auth module
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after sign out
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Nav, NavDropdown } from 'react-bootstrap';

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  // Sign out handler
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login page after sign out
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
      <Link className="navbar-brand" to="/"><img src="../images/logo.png" className='logo'/></Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul className="navbar-nav ml-auto"> {/* Use ml-auto class to push items to the right */}
          <li className="nav-item px-3">
            <Link className="nav-link" to="/home">Home</Link>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" to="/UserProfile">Profile Update</Link>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" to="/makeadmin">Admin Role</Link>
          </li>
          <li className={`nav-item px-3 dropdown ${dropdownOpen ? 'show' : ''}`} onMouseEnter={() => toggleDropdown()} onMouseLeave={() => toggleDropdown()}>
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Report Template
              </a>
              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/ReportTemplateCreator">Create Report Template</Link>
                <Link className="dropdown-item" to="/ReportTemplateCreator">Edit Report Template</Link>
                <Link className="dropdown-item" to="/ReportTemplateCreator">Delete Report Template</Link>
                {/* Add more dropdown items here */}
              </div>
            </li>

          <li className="nav-item ml-auto">
            <button onClick={handleSignOut} className="btn btn-outline-danger my-2 my-sm-0" type="button">
            <i className="bi bi-power"></i> Sign Out
            </button>
          </li>
        </ul>
      </div>
    </Nav>
  );
}

export default Navbar;
