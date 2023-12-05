const { createTransport } = require('nodemailer');

async function submitData(req, res) {
    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight OPTIONS Requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Check the request method
    if (req.method !== 'POST') {
        return res.status(400).send('Invalid request method');
    }

    // Check if the Content-Type header is set to application/json
    if (req.get('Content-Type') !== 'application/json') {
        return res.status(400).send('Invalid Content-Type. Expected application/json');
    }

    try {
        // Parse JSON data from the request body
        const jsonData = req.body;

        // Email configuration
        const to = 'pankaj250483@gmail.com';
        const subject = req.body.Reqtype;

        // Build email body from JSON data
        let body = '<html><body><style>table, th, td {border: 1px solid black;border-collapse: collapse;}</style><h1>'+req.body.Reqtype+'</h1><table style="widht:100%" border=1>';
        for (const key in jsonData) {
            body += `<tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td>${jsonData[key]}</td></tr>`;
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
        };

        subjectreply="Thanks for your interest.";
        if(req.body.Reqtype=='Contact Form Query')
        {
        bodyreply=
        `
        <p>Dear ${req.body.FirstName+" "+req.body.LastName},<p>
        <p>Thank you for reaching out to Maximal Security. We appreciate your interest in our professional services.</p>
        <p>This is an automated response to let you know that we have received your inquiry, and one of our dedicated representatives will be in touch with you shortly.</p>
        <p>In the meantime, if you have any urgent questions or if you would like to speak with one of our service professionals immediately, feel free to contact our office directly at <a href='tel:+18447633567'>844-763-3567</a>. When calling, please choose prompt 1 to be connected with the representative who can address your inquiries promptly.</p>
        <p>Thank you once again for considering Maximal Security. We look forward to the opportunity to serve you.</p>
        <p>Best Regards,</p>
        <p>Maximal Security Services Team<br>
        info@maximalsecurityservices.com<br>
        www.maximalsecurityservices.com<br>
        (844) 763-3567<br>
        <img src='https://maximal-security-services.web.app/images/logo.png' style='width:70px;height:50px;'></p>   
        `;
        }
        else if (req.body.Reqtype=='Careers Form Query')
        {
            bodyreply=
            `
            <p>Dear ${req.body.FirstName+" "+req.body.LastName},</p>
            <p>Thank you for expressing your interest in joining Maximal Security Services as part of our dedicated team. We appreciate the time and effort you invested in submitting your employment application.</p>
            <p>This automated response is to confirm that we have received your inquiry, and our hiring team will carefully review your application.</p> 
            <p>Please be assured that your application is important to us, and we will make every effort to thoroughly evaluate your qualifications. Our team will reach out to you via email or phone to discuss the next steps in the hiring process if your skills and experience align with our current needs.</p>
            <p>Thank you again for considering Maximal Security Services as your employer of choice. We look forward to the possibility of working together.</p>
            <p>Best Regards,</p>
            <p>Maximal Security Services Team<br>
            info@maximalsecurityservices.com<br>
            www.maximalsecurityservices.com<br>
            (844) 763-3567<br>
            <img src='https://maximal-security-services.web.app/images/logo.png' style='width:70px;height:50px;'></p>   
            `;            
        }

        const mailOptionsreply = {
            from: 'noreply@MaximalSecurityServices.com' ,
            to: req.body.Email,
            subject: subjectreply,
            html: bodyreply,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        const inforeply = await transporter.sendMail(mailOptionsreply);
        console.log('Email sent:', info.response);
        res.status(200).send('{"success":"Email sent successfully"}');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
}

module.exports = { submitData };
