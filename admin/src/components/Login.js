import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const isAdmin = idTokenResult.claims.admin;
        if (isAdmin) {
          navigate('/home'); // Redirect admin users
        } else {
          auth.signOut();
          navigate('/unauthorised'); // Redirect regular users
        }
      } else {
        setError('User not found after login.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === 'auth/invalid-credential') {
        setError('The credentials are invalid.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
    }
  };
  

  return (
    <div className="container mt-5" data-aos="flip-left">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-8">
          <div className="card">
            <div className="card-header text-center text-white">
              <div>
                <a href="https://maximalsecurityservices.com">
                  <img src="/images/logo.png" alt="Logo" className="w-50"/>
                </a>
              </div>
            </div>
            <div className="card-body">
              <h3 className="mb-0 text-center">ADMIN PORTAL</h3>
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
              <div className="mt-3">
                <p className="text-center text-primary">
                  Don't have an account?  
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
