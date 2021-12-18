const gatewayCreate = require('./gateway/create.validation');
const gatewayUpdate = require('./gateway/update.validation');
const peripheralCreate = require('./peripheral/create.validation');
const peripheralUpdate = require('./peripheral/update.validation');

module.exports = {
  gatewayCreate,
  gatewayUpdate,
  peripheralCreate,
  peripheralUpdate,
};
