exports.checkIfIntegerAndPositive = (num) =>
  !Number.isNaN(num) && num !== Infinity && num >= 0 && Number.isInteger(num);

exports.pagination = (currentPage, perPage) => {
  const page = this.checkIfIntegerAndPositive(currentPage)
    ? currentPage - 1
    : 0;
  const limit = this.checkIfIntegerAndPositive(perPage) ? perPage : 10;
  return {
    skip: page * limit,
    limit,
  };
};

// eslint-disable-next-line
exports.logDir = (object) => console.dir(object, {depth: null});

exports.patternCheck = (pattern, string) => new RegExp(pattern).test(string);

exports.failed = (res, status, message) =>
  res.status(status).json({
    status,
    message,
  });

exports.success = (res, data, status, message) =>
  res.status(status).json({
    status,
    data,
    message,
  });
