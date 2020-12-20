class ValidatorError {
  constructor(msg, path) {
    this.status = 400;
    this.message = msg;
    this.source = path;
  }
}
class ValidatorErrorArray {
  constructor(errors) {
    if (Array.isArray(errors)) {
      throw new ValidatorError('To use ValidatorErrorArray your param has to be an array');
    }
    this.status = 400;
    this.errors = errors;
  }
}
class NotFoundError {
  constructor(msg) {
    this.status = 404;
    this.message = msg;
  }
}
class ServerError {
  constructor(msg) {
    this.status = 500;
    this.message = msg;
  }
}

module.exports = {
  ServerError,
  ValidatorError,
  ValidatorErrorArray,
  NotFoundError
};
