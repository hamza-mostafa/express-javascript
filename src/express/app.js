const logger = require('morgan');
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
// eslint-disable-next-line
const dotenv = require('dotenv').config({
  path: '.env',
});
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const routes = require('./routes/index');
const { logDir } = require('./helpers/index.helper');
const {
  MongoInputSanitizer,
} = require('./middlewares/MongoSanitizer.middleware');

const { DB_PORT, DB_NAME, DB_HOST } = process.env;

// Mongoose Configuration
mongoose.set('debug', false);
mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
  .then(() => {
    // eslint-disable-next-line
      console.log('DB connection successful');
  })
  .catch((err) => {
    logDir(err);
  });

app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(logger('combined'));
app.use('/api/v1-0-0', MongoInputSanitizer, routes);

module.exports = app;
