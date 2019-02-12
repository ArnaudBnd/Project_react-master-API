'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _likes = require('../models/likes');

var _likes2 = _interopRequireDefault(_likes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  var _req$body = req.body,
      idElementLiked = _req$body.idElementLiked,
      user = _req$body.user;


  _likes2.default.query({
    where: { idElementLiked: idElementLiked, user: user }
  }).fetchAll().then(function (response) {
    if (response.length === 0) {
      _likes2.default.forge({
        idElementLiked: idElementLiked,
        user: user
      }).save().then(function () {
        return res.json({ success: true });
      });
    } else {
      res.json({ error: 'already exist' });
    }
  });
});

exports.default = router;