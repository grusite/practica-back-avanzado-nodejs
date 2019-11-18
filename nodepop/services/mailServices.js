const nodemailer = require('nodemailer')
const { mail, frontUrl } = require('../parameters')
const debug = require('debug')('app:mail')
const dns = require('dns')
const { validate } = require('email-validator')
const { InvalidData } = require('../lib/exceptionPool')
const _ = require('lodash')
const fs = require('fs-extra')
const { resolve } = require('path')

function loadFile(name) {
  fs.readFileSync(resolve(__dirname, `../views/templates/${name}`))
}

const getTemplate = name => {
  _.template(loadFile(name))
}

const confirmEmailHtmlTpl = getTemplate('confirmEmail.html')
const confirmEmailTextTpl = getTemplate('confirmEmail.txt')
const changePasswordHtmlTpl = getTemplate('changePassword.html')
const changePasswordTextTpl = getTemplate('changePassword.txt')

let transport

async function loadTransport() {
  transport = nodemailer.createTransport(mail.transports[mail.transport])
  require('debug')('root:mail')('transport', mail.transport)
}

async function sendVerifyMail(email, token) {
  const url = `${frontUrl}/confirm/${token}`
  debug('send-verify', email)
  const message = {
    from: mail.sender,
    to: email,
    subject: 'Confirma tu correo - Mis Escapes',
    text: confirmEmailTextTpl({ url }),
    html: confirmEmailHtmlTpl({ url }),
  }

  const res = await transport.sendMail(message)
  return res
}
async function sendForgotPasswordMail(email, token) {
  const url = `${frontUrl}/change-password/${token}`

  debug('send-forgot', email)
  const message = {
    from: mail.sender,
    to: email,
    subject: 'Cambiar contraseña - Mis Escapes',
    text: changePasswordTextTpl({ url }),
    html: changePasswordHtmlTpl({ url }),
  }

  const res = await transport.sendMail(message)
  return res
}

async function validateEmail(email) {
  if (!validate(email))
    throw new InvalidData({ reason: 'invalidEmailFormat', message: 'Invalid email format' })
  const [, domain] = email.split('@')
  return new Promise((resolve, reject) => {
    dns.resolve(domain, 'MX', (err, addresses) => {
      if (err) return reject(new InvalidData(err.message))
      if (!addresses || !addresses.length)
        return reject(
          new InvalidData({ reason: 'noMXRecords', message: 'No MX records for domain' })
        )
      resolve()
    })
  })
}

module.exports = {
  sendVerifyMail,
  loadTransport,
  validateEmail,
  sendForgotPasswordMail,
}
