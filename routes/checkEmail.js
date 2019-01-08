import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/user'

const nodemailer = require('nodemailer')

let router = express.Router()

router.post('/', (req, res) => {
  User.query({
    where: { email: req.body.email },
  }).fetch().then(user => {
    if (user) {
      // Create token for user connect
      const token = jwt.sign({
        id: user.get('id'),
        username: user.get('username')
      }, config.jwtSecret, { expiresIn: '1h'})

      User.where({
        id: user.get('id')
      }).save({
        resetPasswordToken: token
      }, {patch:true}).then((resToken) => {
        res.json({ resToken })
      })

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'projetreactemail@gmail.com',
          pass: 'ProjetReact78500'
        }
      })

      const mailOptions = {
        from: 'projetreactemail@gmail.fr',
        to: 'arnaudbenede@hotmail.fr',
        subject: 'TEST PASSWORD',
        html: '<p>Veullez cliquer sur le lien ci-dessus pour changer votre adresse mail</p>'
        + `http://localhost:3006/reset/${token}`
      }

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('err: ', err)
        } else {
          res.json(200).json('recovery email sent')
        }
      })
    } else {
      res.json({error: 'Error mail not exist'})
    }
  }).catch(err => res.status(500).json({ error: err }))
})

export default router
