'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _notifications = require('../models/notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:username', function (req, res) {
  _notifications2.default.query({
    where: { username: req.params.username },
    select: ['id_element_notify']
  }).fetchAll().then(function (ids) {
    var idTable = ids.serialize();
    var tabl = [];

    // tableau d'id_element_notify
    for (var i = 0; i < idTable.length; i++) {
      tabl.push(idTable[i].id_element_notify);
    }

    // get coms with id_element_notify
    _comment2.default.query(function (q) {
      q.innerJoin('notifications', 'comments.id', 'notifications.id_element_notify'), q.where('comments.id', 'in', tabl), q.select('notifications.read', 'notifications.id_element_notify', 'comment', 'user', 'date', 'idPost');
    }).orderBy('date', 'asc').fetchAll().then(function (resp) {
      var com = resp.serialize();
      res.json({ com: com });
    });
  });
});

router.get('/notify/:idPost', function (req, res) {
  // On recupère le username du createur du post
  _post2.default.query({
    innerJoin: ['users', 'idUser', 'users.id'],
    select: ['users.username', 'users.id'],
    where: { 'posts.id': req.params.idPost }
  }).fetch().then(function (user) {
    var object = user.serialize();
    var username = object.username;
    var idUser = object.id;
    var dataUser = {
      idUser: idUser,
      username: username
    };
    res.json({ dataUser: dataUser });
  });
});

router.post('/update', function (req, res) {
  _notifications2.default.where({
    id_element_notify: req.body.id_element_notify
  }).save({
    read: true
  }, { patch: true }).then(function (notification) {
    res.json({ notification: notification });
  });
});

router.delete('/:id_element_notify', function (req, res) {
  _notifications2.default.query({
    where: { id_element_notify: req.params.id_element_notify }
  }).destroy().then(function (notif) {
    res.json({ notif: notif });
  });
});

exports.default = router;