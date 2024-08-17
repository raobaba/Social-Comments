const express = require("express");
require("dotenv").config();
require('events').EventEmitter.defaultMaxListeners = 20;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Connection = require("./config/database");
const allRouter = require("./routes/index");
const { swaggerUi, openapiSpecification } = require("./../docs/swagger");
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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
console.log(app.listenerCount('connection'));
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
