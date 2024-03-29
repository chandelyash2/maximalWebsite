import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseconfig'; // Import auth correctly
import { onAuthStateChanged } from 'firebase/auth'; // Import if you're using onAuthStateChanged
import { Navigate } from 'react-router-dom'; // Or whatever routing you are using

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To handle the initial loading state

  useEffect(() => {
    // This will only be executed once when the component mounts due to the empty dependencies array.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false); // Update the loading state
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (isLoading) {
    // You can replace this with a loading spinner or any loading component
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // User is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
