import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database'; // Import the getDatabase function


const firebaseConfig = {
  apiKey: "AIzaSyCR-soGi4VvGPwNq-1NWLthPZXwwcoGZo8",
  authDomain: "maximal-security-services.firebaseapp.com",
  projectId: "maximal-security-services",
  storageBucket: "maximal-security-services.appspot.com",
  messagingSenderId: "599144898107",
  appId: "1:599144898107:web:f7fa697561f057edab861e",
  measurementId: "G-DWS4XY8NEM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp); // Use getDatabase to initialize the database

export { auth, firebaseApp, database };