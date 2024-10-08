import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';
import {getFunctions} from "firebase/functions";

import {firebaseCredential} from "./firebase-credential";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseCredential);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp); // Use getDatabase to initialize the database
const functions = getFunctions(firebaseApp);


export {auth, firebaseApp, database, functions};
