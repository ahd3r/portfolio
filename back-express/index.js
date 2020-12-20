const express = require('express');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.dev.env' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.prod.env' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
}

const { mongoService } = require('./src/utils/db');

const app = express();

mongoService
  .conect()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on port 5000...');
    });
  })
  .catch((e) => {
    throw e;
  });
