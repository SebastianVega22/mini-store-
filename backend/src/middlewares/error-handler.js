const logger = require('../utils/logger');
module.exports = (err, _req, res, _next) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
