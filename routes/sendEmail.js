import express from 'express'

const nodemailer = require('nodemailer')

let router = express.Router()

router.post('/', (req, res) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'projetreactemail@gmail.com',
      pass: 'ProjetReact78500'
    }
  })

  const mail = {
    from: req.body.email,
    to: 'arnaudbenede@hotmail.fr',
    subject: req.body.title,
    text: req.body.content
  }

  transporter.sendMail(mail, (err, response) => {
    if (err) {
      console.error('err: ', err)
    } else {
      res.json(200).json('Email sent')
    }
  })
})

export default router
