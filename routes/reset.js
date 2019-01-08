import express from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config'
import bcrypt from 'bcryptjs'

let router = express.Router()

router.post('/', (req, res) => {
  console.log('here')
  User.query({
    where: { resetPasswordToken: req.body.token }
  }).fetch().then(user => {
    // check si le token a expiré maintenant qu'on l'a trouvé
    jwt.verify(user.get('resetPasswordToken'), config.jwtSecret, (err, decoded) => {
      if (err) {
        console.log(('err: ', err))
        res.send('token expire its too late')
      } else {
        res.status(200).send({
          username: user.get('username'),
          message: 'password can be reset'
        })
      }
    })
  })
})

router.post('/update', (req, res) => {
  const { password } = req.body
  const password_digest = bcrypt.hashSync(password.password, 10)

  // Ajout du nouveau mdp
  User.where({
    username: password.username
  }).save({
    password_digest: password_digest
  }, {patch:true}).then((user) => {
    // Suppression du token après ajout du nouveau mdp
    User.where({
      password_digest: password_digest
    }).save({resetPasswordToken: null }, {patch:true})
    res.json({ user })
  })
})

export default router
