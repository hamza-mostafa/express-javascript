const joi = require('joi');

module.exports = joi.object({
  vendor: joi.string().required().min(5).max(255),
  status: joi.bool().default(false),
});
