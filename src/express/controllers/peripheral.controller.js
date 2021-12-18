const {
  getPeripheral,
  createPeripheral,
  updatePeripheral,
  deletePeripheral,
} = require('../services/peripheral.service');
const { failed, success } = require('../helpers/index.helper');
const { maxDevices } = require('../config/device.config');

function responseSwitcher(
  res,
  state,
  status = null,
  message = null,
  data = null
) {
  switch (parseInt(state, 10)) {
    case 1:
      return success(res, data, status, message);
    case -1:
      return failed(res, 422, 'No gateway found with this serial number');
    case -2:
      return failed(res, 400, `This gateway has ${maxDevices} devices already`);
    default:
      return failed(res, 404, 'No peripheral found with this id');
  }
}

exports.getPeripheral = async (req, res, next) => {
  try {
    const { serialNumber, id } = req.params;
    const response = await getPeripheral(serialNumber, id);
    return responseSwitcher(
      res,
      response.state,
      200,
      'Successfully Peripheral Retrieved',
      response.data
    );
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.createPeripheral = async (req, res, next) => {
  try {
    const { vendor, status } = req.body;
    const response = await createPeripheral(
      req.params.serialNumber,
      vendor,
      !!status
    );
    return responseSwitcher(
      res,
      response.state,
      201,
      'Successfully Peripheral Created and added to Gateway',
      response.data
    );
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.updatePeripheral = async (req, res, next) => {
  try {
    const { vendor, status } = req.body;
    const response = await updatePeripheral(
      req.params.serialNumber,
      req.params.id,
      { vendor, status: !!status }
    );
    return responseSwitcher(
      res,
      response.state,
      200,
      'Successfully Peripheral Updated',
      response.data
    );
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.deletePeripheral = async (req, res, next) => {
  try {
    const { serialNumber, id } = req.params;
    const response = await deletePeripheral(serialNumber, id);
    return responseSwitcher(
      res,
      response.state,
      204,
      'Successfully Peripheral Deleted'
    );
  } catch (e) {
    return failed(res, 400, e.message);
  }
};
