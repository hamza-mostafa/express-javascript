const express = require('express');

const router = express.Router();

const peripheral = require('./peripheral.route');
const gateway = require('./gateway.route');

router.use('/peripheral', peripheral);
router.use('/gateway', gateway);

module.exports = router;
