'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:identifier', function (req, res) {
  _user2.default.query({
    select: ['username', 'email', 'password_digest', 'id'],
    where: { id: req.params.identifier }
  }).fetchAll().then(function (user) {
    res.json({ user: user });
  });
});

router.post('/', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      passwordDigest = _req$body.passwordDigest,
      email = _req$body.email,
      id = _req$body.id;

  var password_digest = _bcryptjs2.default.hashSync(passwordDigest, 10);

  _user2.default.where({
    id: id
  }).save({
    username: username,
    email: email,
    password_digest: password_digest
  }, { patch: true }).then(function (post) {
    return res.json({ post: post });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

exports.default = router;