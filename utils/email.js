const nodemailer = require('nodemailer')

const sendEmail = async options => {
    //create transporter

    const transporter = nodemailer.createTransport({
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'englishLearningOnline',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;