const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.dev.env' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.prod.env' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
}

const { mongoService } = require('./src/utils/db');
const { NotFoundError, ServerError } = require('./src/utils/errors');
const { router: adminRouter } = require('./src/router/admin.router');

const app = express();

app.use(bodyParser.json());

app.use('/admin', adminRouter);

app.use((req, res, next) => {
  if (!res.body) {
    return next(new NotFoundError('Page not found!'));
  }
  res
    .status(req.method === 'POST' ? 201 : 200)
    .send({ data: res.body, pagination: res.pagination });
});
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error(err);
  let error = err;
  if (!error.status) {
    error = new ServerError(error.message || error);
  }
  res
    .status(err.status)
    .send({ status: error.status, error: error.message, path: error.source, errors: error.errors });
});

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
