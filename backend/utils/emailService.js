const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    // For production, use SendGrid, Mailgun, or Gmail with App Password
    // For development, we use Ethereal or just log if no creds

    let transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    } else {
        // Create Ethereal Test Account
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('Using Ethereal Mail for testing');
    }

    // 2. Define email options
    const message = {
        from: `${process.env.FROM_NAME || 'ZentroMall'} <${process.env.FROM_EMAIL || 'noreply@zentromall.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // 3. Send email
    const info = await transporter.sendMail(message);

    if (!process.env.SMTP_HOST) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
        console.log('Message sent: %s', info.messageId);
    }
};

module.exports = sendEmail;
