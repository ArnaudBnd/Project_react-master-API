'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _signup = require('../shared/validations/signup');

var _signup2 = _interopRequireDefault(_signup);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * ValidateInput
 * Check if username or email already exist
 * in DB
 * @param {Object, Fct} data, otherValidations
 * @return {Object, Boolean} errors, isValid
 */
function validateInput(data, otherValidations) {
  var _otherValidations = otherValidations(data),
      errors = _otherValidations.errors;

  return _user2.default.query({
    where: { email: data.email },
    orWhere: { username: data.username }
  }).fetch().then(function (user) {
    if (user) {
      if (user.get('username') === data.username) {
        errors.username = 'There is user with such username';
      }
      if (user.get('email') === data.email) {
        errors.email = 'There is user with such email';
      }
    }

    return {
      errors: errors,
      isValid: (0, _isEmpty2.default)(errors)
    };
  });
}

router.get('/:identifier', function (req, res) {
  _user2.default.query({
    select: ['username', 'email'],
    where: { email: req.params.identifier },
    orWhere: { username: req.params.identifier }
  }).fetch().then(function (user) {
    res.json({ user: user });
  });
});

router.post('/', function (req, res) {
  validateInput(req.body, _signup2.default).then(function (_ref) {
    var errors = _ref.errors,
        isValid = _ref.isValid;

    if (isValid) {
      var _req$body = req.body,
          username = _req$body.username,
          password = _req$body.password,
          email = _req$body.email;

      var password_digest = _bcryptjs2.default.hashSync(password, 10);

      _user2.default.forge({
        username: username, email: email, password_digest: password_digest
      }, { hasTimestamps: true }).save().then(function (user) {
        return res.json({ success: true });
      }).catch(function (err) {
        return res.status(500).json({ error: err });
      });
    } else {
      res.status(400).json(errors);
    }
  });
});

exports.default = router;