import express from 'express';
import path from 'path';
import users from './routes/users';
import checkEmail from './routes/checkEmail';
import reset from './routes/reset';
import auth from './routes/auth';
import posts from './routes/posts';
import comments from './routes/comment';
import profils from './routes/profils';
import bodyParser from 'body-parser';
import cors from 'cors'

let app = express();

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

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(3025, () => console.log('Running on localhost 3000'));
