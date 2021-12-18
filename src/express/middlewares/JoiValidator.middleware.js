const Validators = require('../requestValidator/index.validation');

module.exports = (validator) => {
  if (!Object.prototype.hasOwnProperty.call(Validators, validator)) {
    throw new Error(`'${validator}' validator doesn't exist`);
  }

  return async (req, res, next) => {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      return next();
    } catch (err) {
      return next(res.status(400).json({ status: 400, message: err.message }));
    }
  };
};
