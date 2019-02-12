import express from 'express'
import Like from '../models/likes'

let router = express.Router()

router.post('/', (req, res) => {
  const { idElementLiked, user } = req.body

  Like.query({
    where: { idElementLiked, user }
  }).fetchAll().then(res => {
    if (res.length === 0) {
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

export default router