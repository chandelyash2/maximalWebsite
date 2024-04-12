import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import '../css/style.css';


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
        <div className="col-lg-4 mt-5 col-md-5 px-5 justify-content-center text-center">
              <button class="btn btn-danger mb-4 rounded-pill px-5">ADMINISTRATOR PORTAL</button>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              
                <button type="submit" className="btn btn-danger w-50 rounded-pill">
                  Sign In
                </button>
                <Link to="/register" className="">
                <button className="btn btn-danger w-50 rounded-pill">
                  Register
                </button>
                </Link>

                <button className="btn btn-danger w-50 my-2 rounded-pill">
                  Forget Password
                </button>
              </form>
          </div>
    </div>
    </div>
  );
}

export default Login;
