const nodemailer = require('nodemailer');
const dotenv=require('dotenv')
dotenv.config()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

module.exports = transporter;
