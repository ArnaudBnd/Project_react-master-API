import express from 'express'

import Comment from '../models/comment'

let router = express.Router()

export function deleteByPostId(id) {
  return Comment.query({
    where: { idPost: id }
  }).destroy().then(() => {
    return true
  })
  .catch(err => false)
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
    .then(post => res.json({ success: true }))
    .catch(err => res.status(500).json({ error: err }))
})

router.get('/', (req, res) => {
  Comment.query({
    select: [ 'user', 'comment', 'idPost', 'date', 'id' ]
  }).fetchAll().then(comments => {
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
  }).fetchAll().then(comments => {
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
  })
})

router.delete('/postsDeleted/:idPost', (req, res) => {
  Comment.query({
    where: { idPost: req.params.idPost }
  }).destroy().then(post => {
    res.json({ post })
  })
})

export default router
