const { pagination, success, failed } = require('../helpers/index.helper');
const {
  getGateways,
  getGateway,
  createGateway,
  updateGateway,
  deleteGateway,
} = require('../services/gateway.service');

function responder(res, response, status, message) {
  return response && response.length !== 0
    ? success(res, response, status, message)
    : failed(res, 404, 'No gateway found with this serial number');
}

exports.getGateways = async (req, res, next) => {
  try {
    const { skip, limit } = pagination(req.params.page, req.params.limit);
    const gateways = await getGateways({}, skip, limit);
    return success(res, gateways, 200, 'Successfully Gateways Retrieved');
  } catch (e) {
    return failed(res, 500, e.message);
  }
};

exports.getGateway = async (req, res, next) => {
  try {
    const response = await getGateway(req.params.serialNumber);
    return responder(res, response, 200, 'Successfully Gateway Retrieved');
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.createGateway = async (req, res, next) => {
  try {
    const response = await createGateway(req.body);
    return responder(res, response, 201, 'Successfully Gateway Created');
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.updateGateway = async (req, res, next) => {
  try {
    const { name, IP, serialNumber } = req.body;
    const response = await updateGateway(
      { serialNumber: req.params.serialNumber },
      { serialNumber, name, IP }
    );
    return responder(res, response, 200, 'Successfully Gateway Updated');
  } catch (e) {
    return failed(res, 400, e.message);
  }
};

exports.deleteGateway = async (req, res, next) => {
  try {
    const response = await deleteGateway(req.params.serialNumber);
    return responder(res, response, 204, '');
  } catch (e) {
    return failed(res, 400, e.message);
  }
};
