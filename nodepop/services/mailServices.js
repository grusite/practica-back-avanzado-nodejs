const dns = require('dns')
const { validate } = require('email-validator')
const { InvalidData } = require('../lib/exceptionPool')

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
  validateEmail,
}
