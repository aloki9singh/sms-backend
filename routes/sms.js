const express = require("express");
const { twilioClient, transporter } = require("../connection/config");
const Otp = require("../models/otp");
const dotenv = require("dotenv");
const otpRouter = express.Router();
dotenv.config();

otpRouter.post("/generate-otp", async (req, res) => {
  try {
    const { appId, identifier, serviceProvider } = req.body;

    // Identify whether the identifier is an email or a mobile number
    const isEmail = /^\S+@\S+\.\S+$/.test(identifier);
    const identifierType = isEmail ? "email" : "mobile";

    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    const otp = new Otp({
      appId,
      identifier,
      identifierType,
      otp: otpCode,
      expiry: new Date(Date.now() + 600000), // Set OTP to expire in 10 minutes
      verified: false,
      serviceProvider,
      createdAt: new Date(),
    });

    await otp.save();

    console.log(
      `Sending OTP (${otpCode}) to: ${identifier} (${identifierType})`
    );

    // Send OTP via Twilio for mobile numbers
    if (!isEmail) {
      twilioClient.messages
        .create({
          body: `Your OTP is: ${otpCode}`,
          to: identifier, // The recipient's phone number
          from: process.env.mobile,
        })
        .then((message) => {
          console.log(`Message sent to ${identifier} with SID: ${message.sid}`);
          res.json({
            message: "OTP generated and stored successfully",
            appId: appId,
          });
        })
        .catch((error) => {
          console.error(
            `Error sending message to ${identifier}: ${error.message}`
          );
          res
            .status(500)
            .json({ error: "An error occurred while generating OTP" });
        });
    } else {
      // Send OTP via Nodemailer for email addresses

      const mailOptions = {
        from: process.env.email,
        to: identifier,
        subject: "Your OTP",
        text: `Your OTP is: ${otpCode}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(
            `Error sending email to ${identifier}: ${error.message}`
          );
          res
            .status(500)
            .json({ error: "An error occurred while generating OTP" });
        } else {
          console.log(
            `Email sent to ${identifier} with response: ${info.response}`
          );
          res.json({
            message: "OTP generated and stored successfully",
            appId: appId,
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while generating OTP" });
  }
});

otpRouter.post("/verify-otp", async (req, res) => {
  try {
    const { appId, otp } = req.body;

    const existingOtp = await Otp.findOne({
      appId,
      otp,
      expiry: { $gt: new Date() },
      verified: false,
    });

    if (existingOtp) {
      existingOtp.verified = true;
      await existingOtp.save();
      res.json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while verifying OTP" });
  }
});

module.exports = {
  otpRouter,
};

// const express = require("express");
// const { twilioClient } = require("../connection/config");
// const Otp = require("../models/otp");
// const dotenv = require('dotenv')
// const otpRouter = express.Router();
// dotenv.config()
// otpRouter.post("/generate-otp", async (req, res) => {
//   try {
//     const { appId, identifier, identifierType, serviceProvider } = req.body;
//      console.log(appId, identifier, identifierType, serviceProvider)
//     // Generate a random 6-digit OTP
//     const otpCode = Math.floor(100000 + Math.random() * 900000);

//     const otp = new Otp({
//       appId,
//       identifier,
//       identifierType,
//       otp: otpCode,
//       expiry: new Date(Date.now() + 600000), // Set OTP to expire in 10 minutes
//       verified: false,
//       serviceProvider,
//       createdAt: new Date(),
//     });

//     await otp.save();

//     console.log(`Sending OTP (${otpCode}) to: ${identifier}`);

//     // Send OTP via Twilio SMS
//     twilioClient.messages.create({
//       body: `Your OTP is: ${otpCode}`,
//       to: identifier, // The recipient's phone number or email address
//       from: process.env.mobile,
//     })
//     .then(message => {
//       console.log(`Message sent to ${identifier} with SID: ${message.sid}`);
//       res.json({ message: "OTP generated and stored successfully" });
//     })
//     .catch(error => {
//       console.error(`Error sending message to ${identifier}: ${error.message}`);
//       res.status(500).json({ error: "An error occurred while generating OTP" });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while generating OTP" });
//   }
// })

// // Verify OTP
// otpRouter.post("/verify-otp", async (req, res) => {
//   try {
//     const { appId, identifier, otp } = req.body;

//     const existingOtp = await Otp.findOne({
//       appId,
//       identifier,
//       otp,
//       expiry: { $gt: new Date() },
//       verified: false,
//     });

//     if (existingOtp) {
//       existingOtp.verified = true;
//       await existingOtp.save();
//       res.json({ message: "OTP verified successfully" });
//     } else {
//       res.status(400).json({ error: "Invalid or expired OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while verifying OTP" });
//   }
// });

// module.exports = {
//   otpRouter,
// };
