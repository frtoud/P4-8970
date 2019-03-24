'use strict';

const nodeMailer = require('nodemailer');

class Mailer {
    constructor(host, port, isSecure) {
        this.transporter = nodeMailer.createTransport({
            host: host,
            port: port,
            secure: isSecure
        });
    }

    sendMail(from, to, subject, text, html) {
        let mailOptions = {
            from: `"POLYFORMS" ${from}`, 
            to: to, 
            subject: subject, 
            text: text, // Plain text body
            html: html // HTML body
        };
        return this.transporter.sendMail(mailOptions)
        .then(info => console.log('Message %s sent: %s', info.messageId, info.response))
        .catch(err => err);
    }
}

module.exports = Mailer;