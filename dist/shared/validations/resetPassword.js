'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatePassword;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* validateInput to tcheck from sign up
* @param {Object} data
* @return {Object or Boolean} errors or isValid
*/
function validatePassword(data) {
  var errors = {};

  if (!_validator2.default.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match ';
  }

  return {
    errors: errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
}