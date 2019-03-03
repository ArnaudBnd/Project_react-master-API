import express from 'express'
import Notification from '../models/notifications'
import Post from '../models/post'
import { deleteByPostId } from './comment'

let router = express.Router()

router.post('/', (req, res) => {
  const { idCategorie, idUser, title, content } = req.body

  Post.forge({
    idUser,
    idCategorie,
    title,
    content
  }, { hasTimestamps: true })
    .save()
    .then(post => res.json({ success: true }))
    .catch(err => res.status(500).json({ error: err }))
})

router.post('/update', (req, res) => {
  Post.where({
    id: req.body.idPostToUpdate
  }).save({
    id: req.body.idPostToUpdate,
    title: req.body.title,
    content: req.body.content
  }, {patch:true}).then((post) => {
    res.json({ post })
  })
  .catch(err => res.status(500).json({ error: err }))
})

router.get('/', (req, res) => {
  Post.query({
    innerJoin: [ 'users', 'idUser', 'users.id' ],
    select: [ 'users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie' ],
    where: { idCategorie: 2 }
  }).fetchAll().then(post => {
    res.json({ post })
  })
  .catch(err => res.status(500).json({ error: err }))
})

router.get('/allPost', (req, res) => {
  Post.query({
    innerJoin: [ 'users', 'idUser', 'users.id' ],
    select: [ 'users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie' ]
  }).fetchAll().then(post => {
    res.json({ post })
  })
  .catch(err => res.status(500).json({ error: err }))
})

router.get('/:id', (req, res) => {
  Post.query({
    where: { idUser: req.params.id }
  }).fetchAll().then(posts => {
    res.json({ posts })
  })
})

router.get('/display/:idPost', (req, res) => {
  Post.query({
    innerJoin: [ 'users', 'idUser', 'users.id' ],
    select: [ 'users.username', 'title', 'content', 'posts.created_at', 'posts.id', 'idCategorie' ],
    where: { 'posts.id': req.params.idPost }
  }).fetchAll().then(posts => {
    res.json({ posts })
  })
})

router.delete('/:id', (req, res) => {
  Post.query({
    where: { id: req.params.id }
  }).destroy()
    .then(post => {
      deleteByPostId(req.params.id)
        .then((idsComs) => {
          // idCom a delete en notification
          // lorsque qu'un post est delete
          Notification.query((q) => {
            q.where('id_element_notify', 'in', idsComs)
          }).destroy().then(() => {
            return true
          })
      })
      res.json({ post })
    })
    .catch(err => res.status(500).json({ error: err }))
})

export default router
