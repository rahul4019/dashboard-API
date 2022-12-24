const express = require('express');
const connectWithDb = require('./config/db');
require('dotenv').config();
const app = express();

// connect to the database
connectWithDb();

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use express router
app.use('/', require('./routes'));

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log(`Error in running server: ${error}`);
  }
  console.log(`Server is up and running at port: ${process.env.PORT}`);
});
