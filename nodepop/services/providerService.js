/* istanbul ignore next */

const { FB } = require('fb')
const { OAuth2Client } = require('google-auth-library')

exports.getProfileFromFacebook = async ({ accessToken }) => {
  const app = await FB.api('app', { access_token: accessToken })
  if (app.id !== process.env.FB_APPID) throw new Error('invalid app id')

  const { id, email, name } = await FB.api('me', {
    fields: 'id,name,email',
    access_token: accessToken,
  })

  return { email, name, data: { id } }
}

exports.getProfileFromGoogle = async ({ idToken }) => {
  const ticket = await new OAuth2Client().verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENTID,
  })
  const { sub: id, email, name } = ticket.getPayload()

  return { email, name, data: { id } }
}
