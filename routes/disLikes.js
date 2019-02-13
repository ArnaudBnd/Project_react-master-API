import express from 'express'
import DisLikes from '../models/disLikes'

let router = express.Router()

router.post('/', (req, res) => {
  const { idElementDisliked, user } = req.body

  DisLikes.query({
    where: { idElementDisliked, user }
  }).fetchAll().then(response => {
    if (response.length === 0) {
      DisLikes.forge({
        idElementDisliked,
        user
      }).save()
        .then(() => res.json({ success: true }))
    } else {
      res.json({error: 'already exist'})
    }
  })

})

router.get('/', (req, res) => {
  DisLikes.query({
    select: [ 'id', 'idElementDisliked', 'user' ]
  }).fetchAll().then(disLikes => {
    res.json({ disLikes })
  })
})

router.delete('/deleted', (req, res) => {
  const { idElementDisliked, user } = req.query

  DisLikes.query({
    where: { idElementDisliked, user }
  }).destroy().then(disLike => {
    res.json({ disLike })
  })
})

export default router