import express from 'express'
import Like from '../models/likes'

let router = express.Router()

router.post('/', (req, res) => {
  const { id_element, id_user } = req.body
  const element = 'post'

  Like.query({
    where: { id_element, id_user }
  }).fetchAll().then(response => {
    if (response.length === 0) {
      Like.forge({
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
  Like.query({
    select: [ 'id', 'id_element', 'id_user' ]
  }).fetchAll().then(likes => {
    res.json({ likes })
  })
})

router.get('/popular', (req, res) => {
  Like.query((q) => {
    q.innerJoin('posts', 'id_element', 'posts.id')
    q.select('id_element', 'posts.title', 'posts.content')
    q.count('id_element')
    q.where('element', '=', 'post')
    q.groupBy('id_element', 'posts.title', 'posts.content')
    q.orderBy('count', 'desc')
    q.limit(5)
  }).fetchAll().then((data) => {
    res.json({ data })
  })
})

router.delete('/deleted', (req, res) => {
  const { id_element, id_user } = req.query

  Like.query({
    where: { id_element, id_user }
  }).destroy().then(like => {
    res.json({ like })
  })
})

export default router