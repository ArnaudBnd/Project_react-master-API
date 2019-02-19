import express from 'express'
import Notification from '../models/notifications'
import Comment from '../models/comment'

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
      q.where('id', 'in', tabl)
    }).orderBy('date', 'asc').fetchAll().then((resp) => {
      const com = resp.serialize()
      res.json({ com })
    })
  })
})

export default router