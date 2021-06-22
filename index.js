//import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
var createError = require('http-errors')

//initialize express
const app = express();

//declare server
const PORT = process.env.SERVER_PORT || 5002;

//initialize middleware services
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :response-time'))
app.use(cookieParser())
app.use((req, res, next) => {
  next(createError(404, 'NotFound'))
})

// connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
    .then(console.log(chalk.blue("Connected to MongoDB")))
    .catch((err) => {console.log(err);})

// Define Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/contacts', require('./routes/contacts'));

//show server is listening
app.listen(PORT, () => {
    console.log(chalk.yellow(`The server has started on port: ${PORT}`))
});