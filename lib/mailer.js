const nodemailer = require('nodemailer');
const {google}=require('googleapis')
const dotenv=require('dotenv')
dotenv.config()

const oAuth2Client=new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentails({refresh_token:REFRESH_TOKEN})

const accessToken=oAuth2Client.getAccessToken()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type:'OAuth2',
        user: process.env.EMAIL,
        password: process.env.PASS,
        clientId: process.env.CLIENT_ID,
        refreshToken:process.env.REFRESH_TOKEN,
        accessToken:accessToken

    }
});

module.exports = transporter;
