const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection successful ...');
  })
  .catch((err) => {
    console.error('No connection', err);
  });
