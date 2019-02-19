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
      q.where('id', 'in', tabl);
    }).orderBy('date', 'asc').fetchAll().then(function (resp) {
      var com = resp.serialize();
      res.json({ com: com });
    });
  });
});

exports.default = router;