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
      id_element = _req$body.id_element,
      id_user = _req$body.id_user;

  var element = 'post';

  _likes2.default.query({
    where: { id_element: id_element, id_user: id_user }
  }).fetchAll().then(function (response) {
    if (response.length === 0) {
      _likes2.default.forge({
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
  _likes2.default.query({
    select: ['id', 'id_element', 'id_user']
  }).fetchAll().then(function (likes) {
    res.json({ likes: likes });
  });
});

router.get('/popular', function (req, res) {
  _likes2.default.query(function (q) {
    q.innerJoin('posts', 'id_element', 'posts.id');
    q.select('id_element', 'posts.title', 'posts.content');
    q.count('id_element');
    q.where('element', '=', 'post');
    q.groupBy('id_element', 'posts.title', 'posts.content');
    q.orderBy('count', 'desc');
    q.limit(5);
  }).fetchAll().then(function (data) {
    res.json({ data: data });
  });
});

router.delete('/deleted', function (req, res) {
  var _req$query = req.query,
      id_element = _req$query.id_element,
      id_user = _req$query.id_user;


  _likes2.default.query({
    where: { id_element: id_element, id_user: id_user }
  }).destroy().then(function (like) {
    res.json({ like: like });
  });
});

exports.default = router;