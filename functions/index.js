const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('./maximal-security-services-firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'maximal-security-services.appspot.com', // Replace with your Firebase Storage bucket URL
});

const app = express();

// Define a route for the Firestore trigger
app.post('/', async (req, res) => {
  try {
    // Access Firestore collection
    const storageDoc = admin.firestore().collection('Storage_Value').doc('your_document_id');

    // Get the document data
    const docSnapshot = await storageDoc.get();
    const storageData = docSnapshot.data();

    // Use the data to perform actions, e.g., upload to Google Cloud Storage
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    const bucket = storage.bucket('maximal-security-services.appspot.com');

    const options = {
      destination: 'upload/hello_world.dog'
    };

    await bucket.upload('../logo.png', options);

    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error updating storage:', error);
    res.status(500).send('Error updating storage');
  }
});

// Export the Express app as a Cloud Function
exports.app = functions.https.onRequest(app);
