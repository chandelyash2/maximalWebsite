import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
// import '../css/Login.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
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

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Login attempt with:", email, password); // Log email and password
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, redirecting..."); // Log on successful login
      window.location.href = '/home'; // Redirect on successful login
    } catch (error) {
      console.error("Login failed:", error); // Log any error
      if (error.code === 'auth/invalid-credential') {
        setError('The credentials are invalid.');
      } else {
        // For other errors, you can either display a generic message
        // or handle specific errors similarly by checking error.code
        setError('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <div className="container mt-5" data-aos="flip-left">
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
            <h3 className="mb-0 text-center">CLIENT PORTAL</h3>
                 {/* Display error message if it exists */}
                 {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
                          {/* Add a "Register" button */}
            <div className="mt-3">
        <p className="text-center text-primary">Don't have an account?  
        <Link to="/register" className="">
          <b> Register</b>
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


export default Login;
