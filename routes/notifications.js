import express from 'express'
import Notification from '../models/notifications'
import Comment from '../models/comment'
import Post from '../models/post'

let router = express.Router()

router.get('/:username', (req, res) => {
  Notification.query({
    where: { username: req.params.username },
    select: [ 'id_element_notify' ]
  }).fetchAll().then(ids => {
    const idTable = ids.serialize()
    const tabl = []

    // tableau d'id_element_notify
    for (let i = 0; i < idTable.length; i++) {
      tabl.push(idTable[i].id_element_notify)
    }

    // get coms with id_element_notify
    Comment.query((q) => {
      q.innerJoin('notifications', 'comments.id', 'notifications.id_element_notify'),
      q.where('comments.id', 'in', tabl),
      q.select('notifications.read', 'comment', 'user', 'date', 'idPost')
    }).orderBy('date', 'asc').fetchAll().then((resp) => {
      const com = resp.serialize()
      res.json({ com })
    })
  })
})

router.get('/notify/:idPost', (req, res) => {
  // On recupère le username du createur du post
  Post.query({
    innerJoin: [ 'users', 'idUser', 'users.id' ],
    select: [ 'users.username', 'users.id' ],
    where: { 'posts.id': req.params.idPost }
  }).fetch().then(user => {
    const object = user.serialize()
    const username = object.username
    const idUser = object.id
    const dataUser = {
      idUser,
      username
    }
    res.json({ dataUser })
  })
})

export default router