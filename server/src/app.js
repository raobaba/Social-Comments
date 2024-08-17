const express = require("express");
require("dotenv").config();
const Connection = require('./config/database')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Connection();

app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;