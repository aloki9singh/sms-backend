const dotenv = require("dotenv");
dotenv.config();
const twilio = require("twilio");
const accountSid = process.env.twilioaccountsid;
const authToken = process.env.twilioauthtoken;
const twilioClient = new twilio(accountSid, authToken);

//nodemailer

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.emailPassword,
  },
});

module.exports = {
  twilioClient,
  transporter,
};
