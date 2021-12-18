const { MongoSanitizerPattern } = require('../config/sanitizer.config');
const { patternCheck } = require('../helpers/index.helper');

exports.MongoInputSanitizer = (req, res, next) => {
  const readableMessage = MongoSanitizerPattern.toString()
    .replace(/([\\/])/g, ' ')
    .replace(/\|/g, ' ');

  [req.body, req.params].forEach((part) => {
    if (part) {
      // eslint-disable-next-line consistent-return
      Object.keys(part).forEach((key) => {
        if (patternCheck(MongoSanitizerPattern, part[key])) {
          return next(
            res.status(400).json({
              status: 400,
              message: `The field ${key} cannot contain any of ${readableMessage}`,
            })
          );
        }
      });
    }
  });
  next();
};
