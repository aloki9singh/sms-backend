const crypto = require("crypto");

function generateUniqueToken() {
  // Generate a random 32-byte token and convert it to a hexadecimal string
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

module.exports = generateUniqueToken;
