'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  var _req$body = req.body,
      identifier = _req$body.identifier,
      password = _req$body.password;

  // Check if user exist in database

  _user2.default.query({
    where: { username: identifier },
    orWhere: { email: identifier }
  }).fetch().then(function (user) {
    if (user) {
      if (_bcryptjs2.default.compareSync(password, user.get('password_digest'))) {
        // Create token for user connect
        var token = _jsonwebtoken2.default.sign({
          id: user.get('id'),
          username: user.get('username')
        }, _config2.default.jwtSecret, { expiresIn: '24h' });
        res.json({ token: token });
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } });
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid Credentials' } });
    }
  });
});

exports.default = router;