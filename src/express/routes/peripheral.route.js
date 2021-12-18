const express = require('express');

const router = express.Router();
const validator = require('../middlewares/JoiValidator.middleware');
const {
  getPeripheral,
  createPeripheral,
  updatePeripheral,
  deletePeripheral,
} = require('../controllers/peripheral.controller');

router
  .get('/:id/gateway/:serialNumber/', getPeripheral)
  .post(
    '/gateway/:serialNumber/',
    validator('peripheralCreate'),
    createPeripheral
  )
  .put(
    '/:id/gateway/:serialNumber/',
    validator('peripheralUpdate'),
    updatePeripheral
  )
  .delete('/:id/gateway/:serialNumber/', deletePeripheral);

module.exports = router;
