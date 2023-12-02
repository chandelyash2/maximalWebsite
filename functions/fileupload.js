// functions/src/file-upload.js
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize Firebase Admin SDK
// admin.initializeApp();

// const bucket = admin.storage().bucket('maximal-security-services.appspot.com');

module.exports = async function uploadFileToStorage(file, fileName) {
    try {
        const filePath = path.join(os.tmpdir(), fileName);

        // Save the file to the local filesystem or process it as needed
        // For example, you can use fs.writeFileSync(filePath, file.buffer);

        // Upload the file to Firebase Cloud Storage
        await bucket.upload(filePath, { destination: fileName });

        // Clean up temp file
        fs.unlinkSync(filePath);

        return 'File uploaded successfully!';
    } catch (error) {
        console.error(error);
        throw new Error('File upload failed.');
    }
};
