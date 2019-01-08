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

var nodemailer = require('nodemailer');

var router = _express2.default.Router();

router.post('/', function (req, res) {
  _user2.default.query({
    where: { email: req.body.email }
  }).fetch().then(function (user) {
    if (user) {
      // Create token for user connect
      var token = _jsonwebtoken2.default.sign({
        id: user.get('id'),
        username: user.get('username')
      }, _config2.default.jwtSecret, { expiresIn: '1h' });

      _user2.default.where({
        id: user.get('id')
      }).save({
        resetPasswordToken: token
      }, { patch: true }).then(function (resToken) {
        res.json({ resToken: resToken });
      });

      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'projetreactemail@gmail.com',
          pass: 'ProjetReact78500'
        }
      });

      var mailOptions = {
        from: 'projetreactemail@gmail.fr',
        to: 'arnaudbenede@hotmail.fr',
        subject: 'TEST PASSWORD',
        html: '<p>Veullez cliquer sur le lien ci-dessus pour changer votre adresse mail</p>' + ('http://localhost:3006/reset/' + token)
      };

      transporter.sendMail(mailOptions, function (err, response) {
        if (err) {
          console.error('err: ', err);
        } else {
          res.json(200).json('recovery email sent');
        }
      });
    } else {
      res.json({ error: 'Error mail not exist' });
    }
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

exports.default = router;