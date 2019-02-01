'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require('nodemailer');

var router = _express2.default.Router();

router.post('/', function (req, res) {

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'projetreactemail@gmail.com',
      pass: 'ProjetReact78500'
    }
  });

  var mail = {
    from: req.body.email,
    to: 'arnaudbenede@hotmail.fr',
    subject: req.body.title,
    text: req.body.content
  };

  transporter.sendMail(mail, function (err, response) {
    if (err) {
      console.error('err: ', err);
    } else {
      res.json(200).json('Email sent');
    }
  });
});

exports.default = router;