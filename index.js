const express = require('express');
const app = express();

const port = 8000;

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use express router
app.use('/', require('./routes'));

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in running server: ${error}`);
  }
  console.log(`Server is up and running at port: ${port}`);
});
