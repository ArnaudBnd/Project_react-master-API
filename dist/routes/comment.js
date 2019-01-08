'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteByPostId = deleteByPostId;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

function deleteByPostId(id) {
  return _comment2.default.query({
    where: { idPost: id }
  }).destroy().then(function () {
    return true;
  }).catch(function (err) {
    return false;
  });
}

router.post('/', function (req, res) {
  var _req$body = req.body,
      user = _req$body.user,
      idPost = _req$body.idPost,
      comment = _req$body.comment,
      date = _req$body.date,
      idCategorie = _req$body.idCategorie;


  _comment2.default.forge({
    user: user,
    idPost: idPost,
    comment: comment,
    date: date,
    idCategorie: idCategorie
  }).save().then(function (post) {
    return res.json({ success: true });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.get('/', function (req, res) {
  _comment2.default.query({
    select: ['user', 'comment', 'idPost', 'date', 'id']
  }).fetchAll().then(function (comments) {
    res.json({ comments: comments });
  });
});

router.get('/:username', function (req, res) {
  _comment2.default.query({
    where: { user: req.params.username }
  }).fetchAll().then(function (comments) {
    res.json({ comments: comments });
  });
});

router.post('/update', function (req, res) {
  console.log('req.body: ', req.body);
  _comment2.default.where({
    id: req.body.idCommentToUpdate
  }).save({
    id: req.body.idCommentToUpdate,
    comment: req.body.comment
  }, { patch: true }).then(function (post) {
    res.json({ post: post });
  });
});

router.delete('/:id', function (req, res) {
  _comment2.default.query({
    where: { id: req.params.id }
  }).destroy().then(function (post) {
    res.json({ post: post });
  });
});

router.delete('/postsDeleted/:idPost', function (req, res) {
  _comment2.default.query({
    where: { idPost: req.params.idPost }
  }).destroy().then(function (post) {
    res.json({ post: post });
  });
});

exports.default = router;