'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  console.log('here');
  _user2.default.query({
    where: { resetPasswordToken: req.body.token }
  }).fetch().then(function (user) {
    // check si le token a expiré maintenant qu'on l'a trouvé
    _jsonwebtoken2.default.verify(user.get('resetPasswordToken'), _config2.default.jwtSecret, function (err, decoded) {
      if (err) {
        console.log(('err: ', err));
        res.send('token expire its too late');
      } else {
        res.status(200).send({
          username: user.get('username'),
          message: 'password can be reset'
        });
      }
    });
  });
});

router.post('/update', function (req, res) {
  var password = req.body.password;

  var password_digest = _bcryptjs2.default.hashSync(password.password, 10);

  // Ajout du nouveau mdp
  _user2.default.where({
    username: password.username
  }).save({
    password_digest: password_digest
  }, { patch: true }).then(function (user) {
    // Suppression du token après ajout du nouveau mdp
    _user2.default.where({
      password_digest: password_digest
    }).save({ resetPasswordToken: null }, { patch: true });
    res.json({ user: user });
  });
});

exports.default = router;