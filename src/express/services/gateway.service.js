const model = require('../models/gateway.model');
const { logDir } = require('../helpers/index.helper');

exports.getGateways = async (query, skip, limit) => {
  try {
    return await model.find(query).limit(limit).skip(skip);
  } catch (e) {
    logDir(e);
    throw Error(`Error while fetching gateways -- ${e.message}`);
  }
};

exports.createGateway = async (query) => {
  try {
    return await model.create(query);
  } catch (e) {
    logDir(e);
    throw Error(`Error while creating gateway -- ${e.message}`);
  }
};

exports.getGateway = async (serialNumber) => {
  try {
    return await model.findOne({ serialNumber });
  } catch (e) {
    logDir(e);
    throw Error(`Error while fetching gateway -- ${e.message}`);
  }
};

exports.updateGateway = async (query, update, receivedOptions = {}) => {
  try {
    const options = Object.assign(receivedOptions, {
      returnNewDocument: true,
      returnDocument: 'after',
    });
    return await model.findOneAndUpdate(query, update, options);
  } catch (e) {
    logDir(e);
    throw Error(`Error while updating gateway -- ${e.message}`);
  }
};

exports.updateOneGateway = async (query, update, options = {}) => {
  try {
    return await model.updateOne(query, update, options);
  } catch (e) {
    logDir(e);
    throw Error(`Error while updating gateway -- ${e.message}`);
  }
};

exports.deleteGateway = async (serialNumber) => {
  try {
    const response = await model.deleteOne({ serialNumber });
    return response.deletedCount;
  } catch (e) {
    logDir(e);
    throw Error(`Error while deleting gateway -- ${e.message}`);
  }
};
