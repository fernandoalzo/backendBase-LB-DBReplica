const { ValidationError, json } = require("sequelize");
const logger = require("../../UTILS/logger");

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    logger.error(`[error.handler.js] ❌ ORM Validation Error: ${err.name}`, err.errors);
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  } else {
    next(err);
  }
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    logger.warn(`[error.handler.js] ⚠️ Boom Error [${output.statusCode}]: ${output.payload.message}`);
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  logger.error(`[error.handler.js] ❌ Unhandled Error: ${err.message}`);
  logger.debug(`[error.handler.js] Stack trace: ${err.stack}`);
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

module.exports = {
  ormErrorHandler,
  boomErrorHandler,
  errorHandler,
};

