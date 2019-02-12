import express from 'express'
import Like from '../models/likes'

let router = express.Router()

router.post('/', (req, res) => {
  const { idElementLiked, user } = req.body

  Like.query({
    where: { idElementLiked, user }
  }).fetchAll().then(response => {
    if (response.length === 0) {
      Like.forge({
        idElementLiked,
        user
      }).save()
        .then(() => res.json({ success: true }))
    } else {
      res.json({error: 'already exist'})
    }
  })
})

router.get('/', (req, res) => {
  Like.query({
    select: [ 'id', 'idElementLiked', 'user' ]
  }).fetchAll().then(likes => {
    res.json({ likes })
  })
})

router.delete('/deleted', (req, res) => {
  const { idElementLiked, user } = req.query

  Like.query({
    where: { idElementLiked, user }
  }).destroy().then(like => {
    res.json({ like })
  })
})

export default router