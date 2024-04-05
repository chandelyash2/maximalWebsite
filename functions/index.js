const functions = require('firebase-functions');

// Set environment variables for common configuration


const { submitForm } = require('./submitForm');
const { submitData } = require('./submitData');
const { makeAdmin } = require('./makeAdmin');

// module.exports = { commonConfig, submitForm, submitData };
// Cloud Functions declarations
exports.submitForm = functions.https.onRequest(submitForm);
exports.submitData = functions.https.onRequest(submitData);
exports.makeAdmin = functions.https.onRequest(makeAdmin);

// Export common config for other modules to use
