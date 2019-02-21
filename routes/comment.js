import express from 'express'

import Comment from '../models/comment'
import Post from '../models/post'
import Notification from '../models/notifications'

let router = express.Router()

export function deleteByPostId(id) {
  return new Promise((resolve) => {
    Comment.query({
      where: { idPost: id }
    }).fetchAll().then((resp) => {
      resolve(resp.map(i => i.id))
      Comment.query({
        where: { idPost: id }
      }).destroy()
        .then(() => {
          return true
        })
    })
  })
}

router.post('/', (req, res) => {
  const { user, idPost, comment, date, idCategorie } = req.body

  Comment.forge({
    user,
    idPost,
    comment,
    date,
    idCategorie
  })
    .save()
    .then((comment) => {
      res.send({ comment })

      // On recupère le username du createur du post
      Post.query({
        innerJoin: [ 'users', 'idUser', 'users.id' ],
        select: [ 'users.username', 'users.id' ],
        where: { 'posts.id': idPost }
      }).fetch().then(user => {
        const object = user.serialize()
        const username = object.username
        const id_element_notify = comment.id
        const id_type = 1
        const tmp = global.socketUser.find(u => u.user == object.id)

        // Quand on a trouvé le user id qui est connecté
        // et qui est l'auteur du post
        // on lui envoie une notification
        if (tmp !== null) {
          tmp.socketSession.emit('userDataToNotify', {
            username,
            comment,
            date,
            user
          })
        }

        Notification.forge({
          username,
          id_element_notify,
          id_type
        }, { hasTimestamps: true })
          .save()
          .then(() => {
            return true
        })
      })

    })
    .catch(err => res.status(500).json({ error: err }))
})

router.get('/', (req, res) => {
  Comment.query({
    select: [ 'user', 'comment', 'idPost', 'date', 'id' ]
  }).orderBy('date', 'asc').fetchAll().then(comments => {
    res.json({ comments })
  })
})

router.get('/:username', (req, res) => {
  Comment.query({
    where: { user: req.params.username }
  }).fetchAll().then(comment => {
    res.json({ comment })
  })
})

router.get('/display/:idPost', (req, res) => {
  Comment.query({
    where: { idPost: req.params.idPost }
  }).orderBy('date', 'asc').fetchAll().then(comments => {
    res.json({ comments })
  })
})

router.post('/update', (req, res) => {
  Comment.where({
    id: req.body.idCommentToUpdate
  }).save({
    id: req.body.idCommentToUpdate,
    comment: req.body.comment
  }, {patch:true}).then((post) => {
    res.json({ post })
  })
})

router.delete('/:id', (req, res) => {
  Comment.query({
    where: { id: req.params.id }
  }).destroy().then(post => {
    res.json({ post })
    Notification.query({
      where: { id_element_notify: req.params.id }
    }).destroy().then(() => {
      return true
    })
  })
})

router.delete('/postsDeleted/:idPost', (req, res) => {
  Comment.query({
    where: { idPost: req.params.idPost }
  }).destroy().then(post => {
    res.json({ post })
    Notification.query({
      where: { id_element_notify: req.params.id }
    }).destroy().then(() => {
      return true
    })
  })
})

export default router
