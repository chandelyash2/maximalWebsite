import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AlertProvider } from './components/AlertContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import UserList from './components/UserList';
import UserAccess from './components/UserAccess';
import ReportAssignUserPermissions from './components/ReportAssignUserPermissions';
import Unauthorised from './components/Unauthorised.js'
import MakeAdmin from './components/MakeAdmin.js'
import ReportGenerate from './components/ReportGenerate.js'
import ReportCustomizeTabular from './components/ReportCustomizeTabular.js';
import ReportCustomizeHybrid from './components/ReportCustomizeHybrid/ReportCustomizeHybrid.js'
import ReportPreviewHybrid from './components/ReportPreviewHybrid/ReportPreviewHybrid.js'
import ReportSelector from './components/ReportSelector.js';
import Reporting from './components/Reporting.js';
import ReportTemplateNew from './components/ReportTemplateNew.js';
import ReportPreview from './components/ReportPreview.js';
import ReportCustomizeDocument from './components/ReportCustomizeDocument.js';
import ReportTemplateEdit from './components/ReportTemplateEdit.js';
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
    document.title = 'Admin Portal - Maximal Security';
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
            <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Login />} />
            <Route path="/login" element={currentUser ? <Navigate to="/home" /> : <Login />} />
            
            {/* PROTECTED ROUTES */}
            <Route path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> 
            <Route path="/UserList" element={<ProtectedRoute><UserList /></ProtectedRoute>} /> 
            <Route path="/ReportAssignUserPermissions" element={<ProtectedRoute><ReportAssignUserPermissions /></ProtectedRoute>} /> 
            <Route path="/UserAccess/:userId" element={<ProtectedRoute><UserAccess /></ProtectedRoute>} /> 
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> 
            <Route path="/Reporting" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
            <Route path="/ReportTemplateNew" element={<ProtectedRoute><ReportTemplateNew /></ProtectedRoute>} />
            <Route path="/ReportCustomizeTabular/:reportTempId" element={<ProtectedRoute><ReportCustomizeTabular /></ProtectedRoute>} />
            <Route path="/ReportCustomizeHybrid/:reportTempId" element={<ProtectedRoute><ReportCustomizeHybrid /></ProtectedRoute>} />
            <Route path="/ReportPreviewHybrid/:reportTempId" element={<ProtectedRoute><ReportPreviewHybrid /></ProtectedRoute>} />
            
            <Route path="/ReportCustomizeDocument/:reportTempId" element={<ProtectedRoute><ReportCustomizeDocument /></ProtectedRoute>} />
            
            <Route path="/ReportPreview/:reportTempId" element={<ProtectedRoute><ReportPreview /></ProtectedRoute>} />
            <Route path="/ReportTemplateEdit" element={<ProtectedRoute><ReportTemplateEdit /></ProtectedRoute>} />

            

            <Route path="/makeadmin" element={<ProtectedRoute><MakeAdmin /></ProtectedRoute>} /> 
            <Route path="/ReportGenerate/:reportName" element={<ProtectedRoute><ReportGenerate /></ProtectedRoute>} /> 
            <Route path="/ReportSelector" element={<ProtectedRoute><ReportSelector /></ProtectedRoute>} /> 
                        
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorised" element={<Unauthorised />} />
          </Routes>
        </AlertProvider>
      </div>
    </Router>
  );
}

export default App;
