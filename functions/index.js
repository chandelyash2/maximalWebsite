// const functions = require('firebase-functions');
const {onRequest} = require("firebase-functions/v1/https");
const functions = require('firebase-functions');
// Set environment variables for common configuration


const {makeAdmin} = require('./makeAdmin');
const {submitForm} = require('./submitForm');
const {submitData} = require('./submitData');
const {listUser} = require('./listUser');
const {generatePdf} = require('./generatePdf');

// module.exports = { commonConfig, submitForm, submitData };
// Cloud Functions declarations
exports.submitForm = onRequest(submitForm);
exports.submitData = onRequest(submitData);
exports.makeAdmin = onRequest(makeAdmin);
exports.listUser = onRequest(listUser);
exports.generatePdf = functions.runWith({ memory: '1GB', timeoutSeconds: 60 }).https.onRequest(generatePdf);

// Export common config for other modules to use
