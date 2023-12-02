const functions = require('firebase-functions');

// Set environment variables for common configuration


const { submitForm } = require('./submitForm');
const { submitData } = require('./submitData');

// module.exports = { commonConfig, submitForm, submitData };
// Cloud Functions declarations
exports.submitForm = functions.https.onRequest(submitForm);
exports.submitData = functions.https.onRequest(submitData);

// Export common config for other modules to use
