const joi = require('joi');

module.exports = joi.object({
  serialNumber: joi.string().required(),
  name: joi.string().required(),
  IP: joi
    .string()
    .required()
    .pattern(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/)
    .messages({
      'string.pattern.base':
        '{{#label}} must match IP pattern e.g: 192.168.1.1',
    }),
  peripherals: joi.array().items({
    vendor: joi.string().required().min(5).max(255),
    status: joi.bool().default(false),
  }),
});
