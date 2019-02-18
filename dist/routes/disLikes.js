'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _disLikes = require('../models/disLikes');

var _disLikes2 = _interopRequireDefault(_disLikes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  var _req$body = req.body,
      id_element = _req$body.id_element,
      id_user = _req$body.id_user;

  var element = 'post';

  _disLikes2.default.query({
    where: { id_element: id_element, id_user: id_user }
  }).fetchAll().then(function (response) {
    if (response.length === 0) {
      _disLikes2.default.forge({
        id_element: id_element,
        id_user: id_user,
        element: element
      }).save().then(function () {
        return res.json({ success: true });
      });
    } else {
      res.json({ error: 'already exist' });
    }
  });
});

router.get('/', function (req, res) {
  _disLikes2.default.query({
    select: ['id', 'id_element', 'id_user']
  }).fetchAll().then(function (disLikes) {
    res.json({ disLikes: disLikes });
  });
});

router.delete('/deleted', function (req, res) {
  var _req$query = req.query,
      id_element = _req$query.id_element,
      id_user = _req$query.id_user;


  _disLikes2.default.query({
    where: { id_element: id_element, id_user: id_user }
  }).destroy().then(function (disLike) {
    res.json({ disLike: disLike });
  });
});

exports.default = router;