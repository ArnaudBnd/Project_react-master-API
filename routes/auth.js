import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/user'

let router = express.Router()

/*
 * To supress space
 * @params name
 * @return newName String
 */
function supressSpaceName(name) {
  let username, lastNameModif

  if (name.indexOf(' ') >= 0) {
    username = name.split(' ').join('_').toLowerCase()
  }
  return username
}

router.post('/', (req, res) => {
  const { identifier, password } = req.body

  // Check if user exist in database
  User.query({
    where: { username: identifier },
    orWhere: { email: identifier }
  }).fetch().then(user => {
    if (user) {
      if (bcrypt.compareSync(password, user.get('password_digest'))) {
        // Create token for user connect
        const token = jwt.sign({
          id: user.get('id'),
          username: user.get('username')
        }, config.jwtSecret, { expiresIn: '24h'})
        res.json({ token })
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } })
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid Credentials' } })
    }
  })
})

export default router
