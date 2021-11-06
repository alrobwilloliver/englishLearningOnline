const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.username;
        this.url = url;
        this.from = `Alan Oliver <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // mailjet
            return nodemailer.createTransport({
                port: process.env.MAIL_JET_PORT,
                host: process.env.STMP_SERVER,
                auth: {
                    user: process.env.MAIL_JET_USERNAME,
                    pass: process.env.MAIL_JET_SECRET_KEY
                }
            })
        }

        return nodemailer.createTransport({
            port: process.env.EMAIL_PORT,
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template, subject) {
        // Send the actual email

        // 1 render html based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            name: this.name,
            url: this.url,
            subject
        })


        // 2 Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
        }

        // 3 Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to AILO learning online!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 mins)')
    }
}
