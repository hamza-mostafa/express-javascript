const express = require('express');
const {
  createGateway,
  getGateways,
  updateGateway,
  deleteGateway,
  getGateway,
} = require('../controllers/gateway.controller');
const validator = require('../middlewares/JoiValidator.middleware');

const router = express.Router();

/* GET home page. */
router
  .get('/', getGateways)
  .post('/', validator('gatewayCreate'), createGateway)
  .get('/:serialNumber', getGateway)
  .put('/:serialNumber', validator('gatewayUpdate'), updateGateway)
  .delete('/:serialNumber', deleteGateway);

module.exports = router;
