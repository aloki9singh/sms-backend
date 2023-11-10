const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://alok:alok@cluster0.zg2cqab.mongodb.net/sms?retryWrites=true&w=majority",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  connection,
};
