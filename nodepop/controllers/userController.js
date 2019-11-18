const providerService = require('../services/providerService')
const debug = require('debug')('app:user')
const { InvalidCredentials, Unauthorized } = require('../lib/exceptionPool')
const jwt = require('jsonwebtoken')

const {
  createUserFromProfile,
  verifyTraditionalUser,
  verifyResendEmail,
  getTraditionalUser,
  createTraditionalUser,
  forgotPasswordEmail,
  changeForgottenPassword,
} = require('../services/userServices')

module.exports = {
  async login(req, res, next) {
    const provider = 'traditional'
    const payload = req.body

    // Get user
    const user = await getUserFromCredentials(provider, payload, next)

    // JWT creation
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    })

    res.redirect('/apiv1/anuncios')

    // Return session bearer
    return { bearer: token }
  },

  async logOut(req, res) {
    // If logged remove token in front side
    res.locals.user = ''
    res.redirect('/')
    return { done: true, message: 'Logout correctly' }
  },

  async loadUser(req, res, next) {
    const [, bearer] = (req.headers.authorization || '').split(' ')
    if (!bearer) {
      next(new Unauthorized('No token provided'))
      //   next()
    }
    // If not valid token I will throw user out
    jwt.verify(bearer, process.env.JWT_SECRET, (err, payload) => {
      req.user = payload._id
      next()
    })
  },

  async requireUser(req, res, next) {
    if (!req.user) next(new Unauthorized())
    next()
  },
  async requireNoUser(req, res, next) {
    if (req.user) next(new Unauthorized('User should not be logged'))
    next()
  },

  async getUser(req, res) {
    return req.user.toPublic()
  },

  async register(req, res) {
    const { email, name, password } = req.body
    await createTraditionalUser({ email, name, password })
    return { done: true, message: `Message sent to ${email}` }
  },

  async verify(req, res) {
    const { token } = req.body
    const cleanToken = Buffer.from(token, 'base64').toString()
    const [userId, verifyEmailKey] = cleanToken.split('|')
    await verifyTraditionalUser(userId, verifyEmailKey)
    return { done: true, message: 'User verified' }
  },

  async verifyResend(req, res) {
    const { email, password } = req.body
    await verifyResendEmail(email, password)
    return { done: true, message: `Message sent to ${email}` }
  },

  async forgotPassword(req, res) {
    const { email } = req.body
    await forgotPasswordEmail(email)
    return { done: true, message: `Message sent to ${email}` }
  },

  async changePassword(req, res) {
    const { token, password } = req.body
    const cleanToken = Buffer.from(token, 'base64').toString()
    const [userId, forgotPasswordKey] = cleanToken.split('|')
    await changeForgottenPassword({ userId, forgotPasswordKey, password })
    return { done: true, message: `Password changed` }
  },
}

/**
 * Given provider data, returns an user from db,
 * if not found and coming from social it creates a new one
 * @param {String} provider google|facebook|traditional
 * @param {Object} payload Provider needed info to login
 */
async function getUserFromCredentials(provider, payload, next) {
  if (!['google', 'facebook', 'traditional'].includes(provider)) {
    next(new InvalidCredentials('Invalid provider'))
  }
  if (!payload || typeof payload !== 'object') {
    next(new InvalidCredentials('Invalid payload'))
  }

  // Traditional
  if (provider === 'traditional') {
    return getTraditionalUser(payload, next)
  }

  // Social
  let profile
  try {
    // Get profile from provider
    if (provider === 'google') {
      profile = await providerService.getProfileFromGoogle(payload, next)
    }
    if (provider === 'facebook') {
      profile = await providerService.getProfileFromFacebook(payload, next)
    }
  } catch (err) {
    next(new InvalidCredentials(err.message))
  }
  debug('login', provider, profile)
  return createUserFromProfile(provider, profile)
}
