import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Corrected import

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <div className="col-lg-4 col-md-8">
          <div className="card">
            <div className="card-header  text-center text-white">
              <div>
                <a href="https://maximalsecurityservices.com">
                 <img src="/images/logo.png" className="w-50"/>
                 </a>
              </div>
            </div>
            <div className="card-body">
            <h3 className="mb-0 text-center">Register</h3>
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
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          placeholder="Enter your name"
          value={name} // Added value attribute
          onChange={(e) => setName(e.target.value)} // Added onChange event
          required 
        />
      </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">
      Email address
    </label>
    <input 
        type="email" 
        className="form-control" 
        id="email" 
        placeholder="Enter your email" 
        value={email} // Added value attribute
        onChange={(e) => setEmail(e.target.value)} // Added onChange event
        required 
      />
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">
      Password
    </label>
    <input 
        type="password" 
        className="form-control" 
        id="password" 
        placeholder="Enter your password" 
        value={password} // Added value attribute
        onChange={(e) => setPassword(e.target.value)} // Added onChange event
        required 
      />
  </div>
  <button type="submit" className="btn btn-danger w-100">
    Register
  </button>
</form>
            <div className="mt-3">
        <p className="text-center text-primary">Already have an account?  
        <Link to="/" className="">
          <b> Login</b>
        </Link>
        </p>
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



    export default Register;
