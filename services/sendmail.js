const nodemailer = require("nodemailer");

const sendMail = async ({ emailId, subject, text, html }) => {
    // Ensure emailId is provided
    if (!emailId) {
        throw new Error("No recipient email address provided.");
    }

    // Connect with SMTP using Ethereal
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lol.huel@ethereal.email',
            pass: 'tU7Hpu7DFpMnJQ6r2U'
        }
    });

    // Log the transporter configuration
    console.log('Transporter created:', transporter);

    // Send email
    let info = await transporter.sendMail({
        from: '"Dipesh Devkota" <devkotadipesh488@gmail.com>', // Sender address
        to: emailId, // Recipient's email
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    return info; // Return the info object if needed
};

module.exports = sendMail;
