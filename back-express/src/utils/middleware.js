const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const { ValidatorErrorArray, ValidatorError } = require('./errors');
const { adminService } = require('../service/admin.service');

const filterOperation = {
  '==': '$eq',
  '!=': '$ne',
  '~=': '$regex',
  '>': '$gt',
  '>=': '$gte',
  '<': '$lt',
  '<=': '$lte'
};

const convertedVal = {
  '\\false': false,
  '\\true': true,
  '\\null': null
};

const sortOperation = {
  asc: 1,
  desc: -1
};

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
  if (req.user.isMain === true) {
    return next();
  }
  return next(new ValidatorError('Admin has to be main', 'authorization'));
};

const isAdminExist = async (req, res, next) => {
  try {
    const { name } = jwt.verify(req.headers.authorization, process.env.SECRET);
    const user = await adminService.getAdmin(name);
    req.user = user;
    return next();
  } catch (e) {
    return next(e);
  }
};

const pagination = (req, res, next) => {
  req.page = 1;
  req.limit = 10;
  if (req.query.page && Number(req.query.page) > 0) {
    req.page = Number(req.query.page);
  }
  if (req.query.limit && Number(req.query.limit) > 0) {
    req.limit = Number(req.query.limit);
  }
  return next();
};

const sortingParser = (allowedFields) => (req, res, next) => {
  req.sort = {};
  if (req.query.sort) {
    if (req.query.sort.split(':').length !== 2) {
      return next(new ValidatorError('Sorting may be only for one field', '?sort='));
    }
    const [field, operation] = req.query.sort.split(':');
    if (!allowedFields.includes(field)) {
      return next(new ValidatorError('Sorting for this field does not allow', '?sort='));
    }
    if (!Object.keys(sortOperation).includes(operation)) {
      return next(new ValidatorError('Sorting operation does not allow', '?sort='));
    }
    req.sort[field] = sortOperation[operation];
  }
  return next();
};

const filteringParser = (allowedFilters) => (req, res, next) => {
  const allowedFields = Object.keys(allowedFilters);
  req.filter = {};
  if (req.query.filter) {
    req.query.filter
      .split(',')
      .map((filter) => filter.trim())
      .forEach((filter) => {
        const operation = Object.keys(filterOperation).find((operation) =>
          filter.includes(operation)
        );
        if (!operation) {
          return next(new ValidatorError('This filtering operation does not exist', '?filter='));
        }
        const [field, val] = filter.split(operation).map((o) => o.trim());
        if (allowedFields.includes(field) && allowedFilters[field].includes(operation)) {
          return next(new ValidatorError('This filtering does not allowed', '?filter='));
        }
        req.filter[field] = {
          [filterOperation]: convertedVal[val] === undefined ? convertedVal[val] : val
        };
      });
  }
  return next();
};

module.exports = {
  isMainAdmin,
  expressValidatorHandler,
  isAdminExist,
  usefulBody,
  pagination,
  sortingParser,
  filteringParser
};
