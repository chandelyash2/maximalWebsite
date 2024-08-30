const admin = require('firebase-admin');
const serviceAccount = require('./maximal-security-services-firebase-adminsdk.json');
const cors = require('cors')({origin: true});

// Check if the Firebase Admin SDK has already been initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'maximal-security-services.appspot.com',
        databaseURL: "https://maximal-security-services-default-rtdb.firebaseio.com",
    });
} else {
    admin.app(); // Use the already initialized app
}

async function makeAdmin(req, res) {
    res.set('Access-Control-Allow-Origin', 'https://admin.maximalsecurityservices.com/makeAdmin');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');

    const {userId, action} = req.body; // Extract userId and action from request body
    if (!userId || !action) {
        return res.status(400).send('User ID and action are required.');
    }

    try {
        if (action === 'grant') {
            await admin.auth().setCustomUserClaims(userId, {admin: true});
            console.log("Admin privileges granted for user:", userId);
            return res.status(200).send("Admin privileges granted successfully.");
        } else if (action === 'revoke') {
            await admin.auth().setCustomUserClaims(userId, {admin: false});
            console.log("Admin privileges revoked for user:", userId);
            return res.status(200).send("Admin privileges revoked successfully.");
        } else {
            return res.status(400).send('Invalid action.');
        }
    } catch (error) {
        console.error("Error setting custom claims:", error);
        return res.status(500).send("Error setting admin privileges.");
    }
}

module.exports = {makeAdmin};
