'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _comment = require('./comment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  var _req$body = req.body,
      idCategorie = _req$body.idCategorie,
      idUser = _req$body.idUser,
      title = _req$body.title,
      content = _req$body.content;


  _post2.default.forge({
    idUser: idUser,
    idCategorie: idCategorie,
    title: title,
    content: content
  }, { hasTimestamps: true }).save().then(function (post) {
    return res.json({ success: true });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.get('/', function (req, res) {
  _post2.default.query({
    innerJoin: ['users', 'idUser', 'users.id'],
    select: ['users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie'],
    where: { idCategorie: 2 }
  }).fetchAll().then(function (post) {
    res.json({ post: post });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.get('/allPost', function (req, res) {
  _post2.default.query({
    innerJoin: ['users', 'idUser', 'users.id'],
    select: ['users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie']
  }).fetchAll().then(function (post) {
    res.json({ post: post });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.get('/:id', function (req, res) {
  _post2.default.query({
    where: { idUser: req.params.id }
  }).fetchAll().then(function (posts) {
    res.json({ posts: posts });
  });
});

router.get('/display/:idPost', function (req, res) {
  _post2.default.query({
    innerJoin: ['users', 'idUser', 'users.id'],
    select: ['users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie'],
    where: { 'posts.id': req.params.idPost }
  }).fetchAll().then(function (posts) {
    res.json({ posts: posts });
  });
});

router.delete('/:id', function (req, res) {
  _post2.default.query({
    where: { id: req.params.id }
  }).destroy().then(function (post) {
    (0, _comment.deleteByPostId)(req.params.id);
    res.json({ post: post });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.post('/update', function (req, res) {
  _post2.default.where({
    id: req.body.idPostToUpdate
  }).save({
    id: req.body.idPostToUpdate,
    title: req.body.title,
    content: req.body.content
  }, { patch: true }).then(function (post) {
    res.json({ post: post });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

exports.default = router;