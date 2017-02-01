function BEMXJSTError(msg, func) {
  this.name = 'BEMXJSTError';
  this.message = msg;

  Error.captureStackTrace(this, func || this.constructor);
}

BEMXJSTError.prototype = Object.create(Error.prototype);
BEMXJSTError.prototype.constructor = BEMXJSTError;

exports.BEMXJSTError = BEMXJSTError;
