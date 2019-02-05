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

router.post('/facebookLogin', (req, res) => {
  const { name, email } = req.body
  const username = supressSpaceName(name)
  const password_digest = ''

  console.log('username: ', username)
  console.log('email: ', email)

  // je le connect
  // sinon en dessous je crée

  User.forge({
    username, email, password_digest
  }, { hasTimestamps: true }).save()
    .then(user => {
      // renvoyer un objet avec id, username, iat, exp
      res.json({ success: true })
    }).catch(err => {
      if (err.detail) {
        // renvoyer un objet avec id, username, iat, exp
        res.json({ success: true })
      }
    })

})

export default router
