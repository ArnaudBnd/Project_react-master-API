import express from 'express'
import User from '../models/user'
import Validator from 'validator'
import isEmpty from 'lodash/isEmpty'
import bcrypt from 'bcryptjs'

let router = express.Router()

router.get('/:identifier', (req, res) => {
  User.query({
    select: [ 'username', 'email', 'password_digest', 'id' ],
    where: { id: req.params.identifier }
  }).fetchAll().then(user => {
    res.json({ user })
  })
})

router.post('/', (req, res) => {
  const { username, passwordDigest, email, id } = req.body
  const password_digest = bcrypt.hashSync(passwordDigest, 10)

  User.where({
    id: id
  }).save({
    username: username,
    email: email,
    password_digest: password_digest
  }, {patch:true})
    .then((post) => res.json({ post }))
    .catch(err => res.status(500).json({ error: err }))
})

export default router