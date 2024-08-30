const functions = require('firebase-functions');
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

const listUser = async (req, res) => {
    try {
        const users = await admin.auth().listUsers(1000); // Get first 1000 users
        const userData = users.users.map(user => ({uid: user.uid, email: user.email})); // Extract user IDs and email addresses

        res.status(200).json({users: userData}); // Return user data in the response
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({error: 'Error fetching users'}); // Handle error
    }
};

module.exports = {listUser};
