import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Corrected import

function Register() {
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Added state for success message
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, navigate to home page
        navigate('/home');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]); // Include navigate as a dependency


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Handle additional logic for name or other info here
      auth.signOut();
      setSuccessMessage('Registration successful! Redirecting to login...'); // Set success message
      setTimeout(() => { // Redirect after a short delay
        
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Registration failed:", error);
      setError('An error occurred during registration. Please try again later.');
    }
  };

  return ( 
    <div className="container mt-5" data-aos="flip-right">
      <div className="row justify-content-center">
      <Link to="https://maximalsecurityservices.com">
      <img src="../images/logo.png" className='logo' title="Visit Website"/>
      </Link>
        <div className="col-lg-4 col-md-8 text-center">
        <button class="btn btn-danger mb-4 rounded-pill px-5">ADMINISTRATOR PORTAL</button>
        <button class="btn btn-danger mb-4 rounded-pill px-5">Register</button>
      
             {/* Display success message if it exists */}
             {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              {/* Display error message if it exists */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
    <form onSubmit={handleRegister}>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          placeholder="First Name"
          value={name} // Added value attribute
          onChange={(e) => setName(e.target.value)} // Added onChange event
          required 
        />
      </div>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          id="lname" 
          placeholder="Last Name"
          value={lname} // Added value attribute
          onChange={(e) => setLname(e.target.value)} // Added onChange event
          required 
        />
      </div>
  <div className="mb-3">
    <input 
        type="email" 
        className="form-control" 
        id="email" 
        placeholder="Email" 
        value={email} // Added value attribute
        onChange={(e) => setEmail(e.target.value)} // Added onChange event
        required 
      />
  </div>
  <div className="mb-3">
    <input 
        type="password" 
        className="form-control" 
        id="password" 
        placeholder="Password" 
        value={password} // Added value attribute
        onChange={(e) => setPassword(e.target.value)} // Added onChange event
        required 
      />
  </div>
  <div className="mb-3">
    <input 
        type="password" 
        className="form-control" 
        id="password" 
        placeholder="Confirm Password" 
        value={cpassword} // Added value attribute
        onChange={(e) => setcPassword(e.target.value)} // Added onChange event
        required 
      />
  </div>
  <button type="submit" className="btn btn-danger mb-4 rounded-pill px-5">
    Register
  </button>
  <Link to="/" className="">
            <button class="btn btn-danger mb-4 rounded-pill px-5 "> Login </button>
            </Link>
</form>
            <div className="mt-3">
         
            </div>
            
        </div>
      </div>
    </div>
  );
}



    export default Register;
