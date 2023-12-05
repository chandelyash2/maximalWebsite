const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();

const app = express();

const storage = new Storage({
  keyFilename: 'maximal-security-services-firebase-adminsdk.json',
  projectId: 'maximal-security-services',
});

const bucket = storage.bucket('maximal-security-services.appspot.com');

app.use(express.json()); // Parse JSON payloads

app.post('/upload', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).send('Invalid JSON payload.');
  }

  const file = bucket.file(filename);
  const buffer = Buffer.from(content, 'base64');

  file.createWriteStream({
    metadata: {
      contentType: 'application/octet-stream', // Adjust as needed
    },
  })
  .on('error', (err) => {
    console.error(err);
    res.status(500).send('Error uploading file.');
  })
  .on('finish', () => {
    console.log('File uploaded successfully.');

    // Optionally, you can trigger a Cloud Function here or perform other actions.
    // For simplicity, let's just respond with a success message.
    res.status(200).send('File uploaded and saved successfully.');
  })
  .end(buffer);
});

exports.expressupload = functions.region('us-central1').https.onRequest(app);
