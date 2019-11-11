const User = require('../models/User')
const { InvalidCredentials } = require('../lib/exceptionPool')
const { validateEmail } = require('../services/mailService')

/**
 * Create or update a user document, using email as glue
 * @param {String} provider Type of provider (google|facebook)
 * @param {Object} profile Properties of user in that provider
 */
async function createUserFromProfile(provider, profile) {
  let user = await User.findOne({ email: profile.email })

  if (!user) {
    user = new User({
      email: profile.email,
      name: profile.name,
    })
  }
  user.provider[provider] = profile.data
  await user.save()
  return user
}

async function getUserFromEmail(email) {
  return User.findOne({ email })
}

async function getTraditionalUser({ email, password }) {
  const user = await findUserByEmailPassword(email, password)

  return user
}

async function findUserByEmailPassword(email, password) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new InvalidCredentials({ reason: 'userNotFound' })
  }

  if (!(await user.comparePassword(password))) {
    throw new InvalidCredentials({ reason: 'invalidPassword' })
  }
  return user
}

async function createUser({ email, name, password }) {
  const foundUser = await getUserFromEmail(email)
  if (foundUser) {
    throw new InvalidCredentials({
      reason: 'registered',
    })
  }

  await validateEmail(email)
  const user = await createUserFromProfile('traditional', {
    email,
    name,
    data: {
      password,
      key: {
        verifyEmail: await generateKey(),
      },
    },
  })
  sendVerifyMail(email, user.getToken('verifyEmail'))
}

module.exports = {
  createSession,
  touchSession,
  createUserFromProfile,
  getUserAndSessionFromBearer,
  getUserFromEmail,
  verifyTraditionalUser,
  getTraditionalUser,
  createUser,
}
