const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Connection = require("./config/database");
const allRouter = require("./routes/index");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());

Connection();
app.use("/api/v1", allRouter);

app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
