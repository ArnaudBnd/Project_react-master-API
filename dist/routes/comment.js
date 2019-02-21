'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteByPostId = deleteByPostId;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _notifications = require('../models/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

function deleteByPostId(id) {
  return new Promise(function (resolve) {
    _comment2.default.query({
      where: { idPost: id }
    }).fetchAll().then(function (resp) {
      resolve(resp.map(function (i) {
        return i.id;
      }));
      _comment2.default.query({
        where: { idPost: id }
      }).destroy().then(function () {
        return true;
      });
    });
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
  }).save().then(function (comment) {
    res.send({ comment: comment });

    // On recupère le username du createur du post
    _post2.default.query({
      innerJoin: ['users', 'idUser', 'users.id'],
      select: ['users.username', 'users.id'],
      where: { 'posts.id': idPost }
    }).fetch().then(function (user) {
      var object = user.serialize();
      var username = object.username;
      var id_element_notify = comment.id;
      var id_type = 1;
      var tmp = global.socketUser.find(function (u) {
        return u.user == object.id;
      });

      // Quand on a trouvé le user id qui est connecté
      // et qui est l'auteur du post
      // on lui envoie une notification
      if (tmp !== null) {
        tmp.socketSession.emit('userDataToNotify', {
          username: username,
          comment: comment,
          date: date,
          user: user
        });
      }

      _notifications2.default.forge({
        username: username,
        id_element_notify: id_element_notify,
        id_type: id_type
      }, { hasTimestamps: true }).save().then(function () {
        return true;
      });
    });
  }).catch(function (err) {
    return res.status(500).json({ error: err });
  });
});

router.get('/', function (req, res) {
  _comment2.default.query({
    select: ['user', 'comment', 'idPost', 'date', 'id']
  }).orderBy('date', 'asc').fetchAll().then(function (comments) {
    res.json({ comments: comments });
  });
});

router.get('/:username', function (req, res) {
  _comment2.default.query({
    where: { user: req.params.username }
  }).fetchAll().then(function (comment) {
    res.json({ comment: comment });
  });
});

router.get('/display/:idPost', function (req, res) {
  _comment2.default.query({
    where: { idPost: req.params.idPost }
  }).orderBy('date', 'asc').fetchAll().then(function (comments) {
    res.json({ comments: comments });
  });
});

router.post('/update', function (req, res) {
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
    _notifications2.default.query({
      where: { id_element_notify: req.params.id }
    }).destroy().then(function () {
      return true;
    });
  });
});

router.delete('/postsDeleted/:idPost', function (req, res) {
  _comment2.default.query({
    where: { idPost: req.params.idPost }
  }).destroy().then(function (post) {
    res.json({ post: post });
    _notifications2.default.query({
      where: { id_element_notify: req.params.id }
    }).destroy().then(function () {
      return true;
    });
  });
});

exports.default = router;