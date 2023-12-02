const { createTransport } = require('nodemailer');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const Busboy = require('busboy');
const functions = require('firebase-functions');
const serviceAccount = require('./maximal-security-services-firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'maximal-security-services.appspot.com',
});

const storage = new Storage();
const bucket = storage.bucket(admin.storage().bucket().name);

async function submitFormbus(req, res) {
    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');


    // Check the request method
    if (req.method !== 'POST') {
        return res.status(400).send('Invalid request method');
    }

    // Initialize Busboy for parsing the incoming form data
    const busboy = new Busboy({ headers: req.headers });

    // Variables to store form fields and uploaded files
    const formData = {};
    const uploadedFiles = [];

    // Handle field data
    busboy.on('field', (fieldname, val) => {
        formData[fieldname] = val;
    });

    // Handle file data
    busboy.on('file', (fieldname, file, filename) => {
        const buffers = [];
        file.on('data', (data) => {
            buffers.push(data);
        });

        file.on('end', () => {
            // Concatenate the buffers and store the file data
            const fileBuffer = Buffer.concat(buffers);
            uploadedFiles.push({ fieldname, filename, buffer: fileBuffer });
        });
    });

    // Finish parsing
    busboy.on('finish', async () => {
        // Email configuration
        const to = 'pankaj250483@gmail.com';
        const subject = 'Form Submission';

        // Build email body from form fields
        let body = '<html><body><h1>Enquiry Form</h1><table>';
        for (const key in formData) {
            body += `<tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td>${formData[key]}</td></tr>`;
        }
        body += `</table></body><style>table,td {border:1px solid grey;}</style></html>`;

        // Create Nodemailer transporter
        const transporter = createTransport({
            service: 'Gmail',
            auth: {
                user: 'vastram4@gmail.com',
                pass: 'lxiarfllqzrtinro',
            },
        });

        // Create email options
        const mailOptions = {
            from: 'pankaj250483@fastmail.com',
            to: to,
            subject: subject,
            html: body,
            attachments: [],
        };

        // Upload files to Firebase Cloud Storage
        for (const file of uploadedFiles) {
            const fileName = `${Date.now()}_${file.filename}`;
            const fileUpload = bucket.file(fileName);
            const blobStream = fileUpload.createWriteStream();

            blobStream.on('error', (error) => {
                console.error('Error uploading file to Firebase Storage:', error);
                res.status(500).send('Error uploading file to Firebase Storage');
            });

            blobStream.on('finish', () => {
                // File uploaded successfully
                const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
                mailOptions.attachments.push({
                    filename: file.filename,
                    path: fileUrl,
                });

                // Check if all files are uploaded before sending the email
                if (mailOptions.attachments.length === uploadedFiles.length) {
                    // Send the email
                    transporter.sendMail(mailOptions, (emailError, info) => {
                        if (emailError) {
                            console.error('Error sending email:', emailError);
                            res.status(500).send('Error sending email');
                        } else {
                            console.log('Email sent:', info.response);
                            res.status(200).send('Email sent successfully');
                        }
                    });
                }
            });

            blobStream.end(file.buffer);
        }
    });

    // Pipe the request into Busboy for parsing
    req.pipe(busboy);
}

module.exports = { submitFormbus };
