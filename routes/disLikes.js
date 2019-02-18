import express from 'express'
import DisLikes from '../models/disLikes'

let router = express.Router()

router.post('/', (req, res) => {
  const { id_element, id_user } = req.body
  const element = 'post'

  DisLikes.query({
    where: { id_element, id_user }
  }).fetchAll().then(response => {
    if (response.length === 0) {
      DisLikes.forge({
        id_element,
        id_user,
        element
      }).save()
        .then(() => res.json({ success: true }))
    } else {
      res.json({error: 'already exist'})
    }
  })

})

router.get('/', (req, res) => {
  DisLikes.query({
    select: [ 'id', 'id_element', 'id_user' ]
  }).fetchAll().then(disLikes => {
    res.json({ disLikes })
  })
})

router.delete('/deleted', (req, res) => {
  const { id_element, id_user } = req.query

  DisLikes.query({
    where: { id_element, id_user }
  }).destroy().then(disLike => {
    res.json({ disLike })
  })
})

export default router