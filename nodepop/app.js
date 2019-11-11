const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./lib/db')

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
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

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Create mongodb conection
 */
app.use(function(req, res, next) {
  if (db.connection.readyState !== 1) throw createError(1100, 'No database connection')
  next()
})

db.connect()

app.use(
  session({
    name: 'nodeapi-session',
    secret: 'kshd fsa78f6sd78f6s8d7f6dsa8fsjghdagfjhasdfs78',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // solo mandar por HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 2, // caducar a los 2 días de inactividad
    },
  })
)

/**
 * Rutas de mi API
 */
app.use('/', indexRouter)
app.use('/login', loginRouter)
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
