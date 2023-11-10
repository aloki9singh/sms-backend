const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  appId: String, // The application identifier
  identifier: String, // Email or mobile number
  identifierType: {
    type: String,
    enum: ["email", "mobile"],
  },
  otp: Number, // The OTP code
  expiry: Date, // Expiry date and time for OTP
  verified: Boolean, // Whether the OTP has been verified or not
  serviceProvider: String, // Service provider for sending OTP (e.g., Twilio, SendGrid)
  serviceProviderResponse: {}, // Response from the service provider
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("otp", otpSchema);
