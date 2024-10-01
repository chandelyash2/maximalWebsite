const admin = require('firebase-admin');
const serviceAccount = require('./maximal-security-services-firebase-adminsdk.json');

// Check if the Firebase Admin SDK has already been initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'maximal-security-services.appspot.com',
        databaseURL: "https://maximal-security-services-default-rtdb.firebaseio.com"
    });
} else {
    admin.app(); // Use the already initialized app
}

const deleteUser = async (data, context) => {
    // You can add more security checks here to ensure only authorized users can delete accounts.
    const uid = data.uid;

    try {
        await admin.auth().deleteUser(uid);
        return {status: true, message: `Successfully deleted user with UID: ${uid}`};
    } catch (error) {
        return {status: false, error: `Error deleting user: ${error.message}`};
    }
}
module.exports = {deleteUser};
