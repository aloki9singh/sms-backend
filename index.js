const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const { otpRouter } = require("./routes/sms");
const { connection } = require('./connection/db');
const app = express();
app.use(express.json())
app.use(cors());
dotenv.config()


app.use("/api", otpRouter);

app.listen(process.env.PORT, () => {
  try {
    connection;
    console.log("listening on port" + process.env.PORT);
  } catch (error) {
    console.log(error);
  }
});
