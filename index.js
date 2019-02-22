import express from 'express';
import path from 'path';
import users from './routes/users';
import checkEmail from './routes/checkEmail';
import reset from './routes/reset';
import sendEmail from './routes/sendEmail';
import likes from './routes/likes';
import disLikes from './routes/disLikes';
import notifications from './routes/notifications';
import auth from './routes/auth';
import posts from './routes/posts';
import comments from './routes/comment';
import profils from './routes/profils';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken'

let app = express();
let socket = require('socket.io');

app.use(bodyParser.json());
// Permet de faire des requêtes sur differentes urls
app.use(cors());

// Fct exécuté pour tout type de demande http sur le chemin /api/users & /api/auth
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/comments', comments);
app.use('/api/profils', profils);
app.use('/api/checkEmail', checkEmail);
app.use('/api/reset', reset);
app.use('/api/send', sendEmail);
app.use('/api/likes', likes);
app.use('/api/disLikes', disLikes);
app.use('/api/notifications', notifications);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

const server = app.listen(3025, () => console.log('Running on localhost 3000'));

global.io = socket(server);

// variable temporel avec tout les users connectés
global.socketUser = [];


/*
 * Chaque utilisateur ca sa propre connection
 *
 */
global.io.on('connection', (socket) => {

    /*
     * Réception du token du user connecté
     *
     */
    socket.on('userLogged', ({ token }) => {
      try {
        const socketId  = socket.id;
        const { id, username } = jwt.decode(token);
        console.log('userLogged > ', id);

        global.socketUser.push({
          user: id,
          socketId,
          socketSession: socket
        })
      } catch (e) {
        // Si y'a une erreur de jwt
      }
    });

    /*
     * Quand un user se deconnect
     * on le delete de socketUser
     */
    socket.on('disconnect', () => {
      // Lors de la deconnection
      // on supprime l'id de socketUser
      // pour garder que ceux qui sont connectés
      global.socketUser  = global.socketUser.filter(s => s.socketId !== socket.id);
    });
});
