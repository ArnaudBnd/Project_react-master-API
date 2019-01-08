'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _users = require('./routes/users');

var _users2 = _interopRequireDefault(_users);

var _checkEmail = require('./routes/checkEmail');

var _checkEmail2 = _interopRequireDefault(_checkEmail);

var _reset = require('./routes/reset');

var _reset2 = _interopRequireDefault(_reset);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _posts = require('./routes/posts');

var _posts2 = _interopRequireDefault(_posts);

var _comment = require('./routes/comment');

var _comment2 = _interopRequireDefault(_comment);

var _profils = require('./routes/profils');

var _profils2 = _interopRequireDefault(_profils);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
// Permet de faire des requêtes sur differentes urls
app.use((0, _cors2.default)());

// Fct exécuté pour tout type de demande http sur le chemin /api/users & /api/auth
app.use('/api/users', _users2.default);
app.use('/api/auth', _auth2.default);
app.use('/api/posts', _posts2.default);
app.use('/api/comments', _comment2.default);
app.use('/api/profils', _profils2.default);
app.use('/api/checkEmail', _checkEmail2.default);
app.use('/api/reset', _reset2.default);

app.get('/*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, './index.html'));
});

app.listen(3025, function () {
  return console.log('Running on localhost 3000');
});