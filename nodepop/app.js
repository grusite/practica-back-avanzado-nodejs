const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const isDev = process.env.NODE_ENV === 'development'
const exceptionPool = require('./lib/exceptionPool')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./lib/db')
const { getMorganConfig } = require('./lib/utils')

const indexRouter = require('./routes/index')
const changeLocale = require('./routes/change-locale')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const adsRouter = require('./routes/apiv1/advertisements')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').__express)
app.set('view engine', 'html')

// I enable Access-Control-Allow-Origin: * in header
app.use(cors())
// support parsing of application/json type post data
app.use(bodyParser.json())

if (isDev) {
  app.use(logger('dev', getMorganConfig()))
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Setup de i18n
 */
const i18n = require('./lib/i18nConfigure')()
app.use(i18n.init)

/**
 * Error in mongodb conection if not ready
 */
app.use(function(req, res, next) {
  if (db.connection.readyState !== 1) next(new exceptionPool.NoDatabase())
  next()
})

// middleware para tener acceso a la sesión en las vistas
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

/**
 * Rutas de mi API
 */
app.use('/', indexRouter)
app.use('/change-locale', changeLocale)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/apiv1/anuncios', adsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res) {
  // comprobar error de validación
  if (err.array) {
    // error de validación
    err.status = 422
    const errInfo = err.array({ onlyFirstError: true })[0]
    err.message = isAPI(req)
      ? { message: 'Nor valid', errors: err.mapped() }
      : `Not valid - ${errInfo.param} ${errInfo.msg}`
  }

  res.status(err.status || 500)

  if (isAPI(req)) {
    res.json({ success: false, error: err.message })
    return
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.render('error')
})

function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0
}

module.exports = app
