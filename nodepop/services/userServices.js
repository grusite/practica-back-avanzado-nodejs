const nanoid = require('nanoid/async')
const User = require('../models/User')
const Session = require('../models/Session')
const { InvalidCredentials, TooSoon } = require('../lib/exceptionPool')
const { sendVerifyMail, sendForgotPasswordMail, validateEmail } = require('../services/mailService')

/**
 * Create a session document for a user
 * @param {Document} user
 */
async function createSession(user) {
  const session = new Session({
    userId: user._id,
    bearer: await nanoid(24),
  })
  await session.save()
  return session
}

/**
 * Touch a document to force update timestamps
 * @param {Document} doc
 */
async function touchSession(doc) {
  doc.updatedAt = null
  await doc.save()
}

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

/**
 * Find session and its user
 * @param {String} bearer Session bearer
 */
async function getUserAndSessionFromBearer(bearer) {
  const session = await Session.findOne({ bearer })
  const user = session && (await User.findById(session.userId))
  return { user, session }
}

async function verifyTraditionalUser(userId, verifyEmailKey) {
  const user = await User.findById(userId)
  if (!user) {
    throw new InvalidCredentials({ reason: 'userNotFound' })
  }
  if (!user.hasProvider('traditional')) {
    throw new InvalidCredentials({ reason: 'userNotTraditional' })
  }
  if (user.isVerified()) {
    throw new InvalidCredentials({ reason: 'userVerified' })
  }
  if (user.provider.traditional.key.verifyEmail !== verifyEmailKey) {
    throw new InvalidCredentials({ reason: 'invalidVerifyEmailToken' })
  }

  user.provider.traditional.key.verifyEmail = null
  await user.save()
}

async function getTraditionalUser({ email, password }) {
  const user = await findUserByEmailPassword(email, password)

  if (!user.isVerified()) {
    throw new InvalidCredentials({ reason: 'userNotVerified' })
  }

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

async function verifyResendEmail(email, password) {
  const user = await findUserByEmailPassword(email, password)

  if (user.isVerified()) {
    throw new InvalidCredentials({ reason: 'userVerified' })
  }

  checkTime(user.provider.traditional.key.verifyEmail)

  user.provider.traditional.key.verifyEmail = await generateKey()
  await user.save()
  sendVerifyMail(email, user.getToken('verifyEmail'))
}

async function createTraditionalUser({ email, name, password }) {
  const foundUser = await getUserFromEmail(email)
  if (foundUser && foundUser.hasProvider('traditional')) {
    throw new InvalidCredentials({
      reason: 'registered',
      verified: foundUser.isVerified(),
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

async function forgotPasswordEmail(email) {
  const user = await User.findOne({ email })

  if (!user) {
    throw new InvalidCredentials({ reason: 'userNotFound' })
  }
  if (user.provider.traditional.key.forgotPassword)
    checkTime(user.provider.traditional.key.forgotPassword)

  user.provider.traditional.key.forgotPassword = await generateKey()
  await user.save()
  sendForgotPasswordMail(email, user.getToken('forgotPassword'))
}

async function changeForgottenPassword({ userId, forgotPasswordKey, password }) {
  const user = await User.findById(userId)
  if (!user) {
    throw new InvalidCredentials({ reason: 'userNotFound' })
  }
  if (!user.hasProvider('traditional')) {
    throw new InvalidCredentials({ reason: 'userNotTraditional' })
  }
  if (user.provider.traditional.key.forgotPassword !== forgotPasswordKey) {
    throw new InvalidCredentials({ reason: 'invalidforgotPasswordToken' })
  }

  user.provider.traditional.password = password
  user.provider.traditional.key.forgotPassword = null

  await user.save()
}

async function generateKey() {
  const rnd = await nanoid(20)
  return now() + '.' + rnd
}

function checkTime(key) {
  if (typeof jest !== 'undefined') return
  const [time] = key.split('.')
  const diff = now() - time
  if (diff < 60) throw new TooSoon()
}

function now() {
  return (Date.now() / 1000) | 0
}
module.exports = {
  createSession,
  touchSession,
  createUserFromProfile,
  getUserAndSessionFromBearer,
  getUserFromEmail,
  verifyTraditionalUser,
  verifyResendEmail,
  getTraditionalUser,
  forgotPasswordEmail,
  createTraditionalUser,
  changeForgottenPassword,
}
