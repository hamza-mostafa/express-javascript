const mongoose = require('mongoose');
const { DB_NAME, DB_PORT, DB_HOST } = require('dotenv').config({
  path: '../../.env.testing',
}).parsed;
const { logDir } = require('../../helpers/index.helper');
const gateway = require('../../models/gateway.model');
const Gateway = require('../../models/gateway.model');

beforeAll(async () => {
  await mongoose
    // eslint-disable-next-line
      .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`).then(() => {
      // eslint-disable-next-line no-console
      console.log('TEST DB connection opened successfully');
    })
    .catch((err) => {
      logDir(err);
    });
});

beforeEach(async () => {
  await Gateway.deleteMany({});
});

afterAll(async () => {
  await gateway.deleteMany({});
  await mongoose.connection.close();
  // eslint-disable-next-line
  console.log('TEST DB connection closed successfully');
});
