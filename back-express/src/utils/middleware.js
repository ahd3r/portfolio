const { validationResult } = require('express-validator');

const { ValidatorErrorArray } = require('./errors');

const expressValidatorHandler = (req, res, next) => {
  const validatorErrors = validationResult(req);
  if (!validatorErrors.isEmpty()) {
    return next(new ValidatorErrorArray(validatorErrors.array()));
  }
  return next();
};

const usefulBody = (fields) => (req, res, next) => {
  Object.keys(req.body).forEach((field) => {
    if (!fields.includes(field)) {
      delete req.body[field];
    }
  });
  return next();
};

const isMainAdmin = (req, res, next) => {
  return next();
};

const isAdminExist = (req, res, next) => {
  // set req.user here
  return next();
};

module.exports = { isMainAdmin, expressValidatorHandler, isAdminExist, usefulBody };
