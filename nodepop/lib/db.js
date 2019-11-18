const debug = require('debug')('nodepop:db')

const mongoose = require('mongoose')
const { URL } = require('url')

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nodepop'

// Funcion para conectarme a la BBDD
function connect() {
  debug('connect', new URL(uri).host)
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, //Disable deprecated options
    err => {
      if (err) {
        debug('error', 'Failed to connect to mongo on startup - retrying in 5 sec', err.message)
        setTimeout(connect, 5000)
      }
    }
  )
}

// Funcion para desconectarme de la BBDD
function disconnect() {
  debug('disconnect')
  mongoose.connection.close()
}

// Debugo cada estado de la conexion
mongoose.connection.on('disconnected', () => debug('disconnected'))
mongoose.connection.on('connected', () => debug('connected'))
mongoose.connection.on('connecting', () => debug('connecting'))
mongoose.connection.on('eror', err => {
  debug('Error de conexion ', err)
  process.exit(1)
})
mongoose.connection.on('disconnecting', () => debug('disconnecting'))

module.exports = {
  connect,
  disconnect,
  connection: mongoose.connection,
}
