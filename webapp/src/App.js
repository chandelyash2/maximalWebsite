// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AlertProvider } from './components/AlertContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import VideoBackground from './components/VideoBackground'; // Import VideoBackground
import { auth } from './firebaseconfig';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

AOS.init({
  duration: 1000, // Animation duration (in milliseconds)
  once: true, // Whether animations should be triggered only once
  mirror: false, // Whether elements should animate when scrolling in the opposite direction
});

function App() {

  const bodyStyle = {
    backgroundColor: '#ede8e2'
  };
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    document.title = 'TISPD';
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, []);

  return (
    <Router>
      <VideoBackground /> 
      {currentUser && <Navbar />} {/* Render Navbar only if currentUser exists */}
      <div className="content">
      <AlertProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/UserProfile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
           
                    <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/register" element={<Register />} />
        </Routes>
        </AlertProvider>
      </div>
    </Router>
  );
}

export default App;
