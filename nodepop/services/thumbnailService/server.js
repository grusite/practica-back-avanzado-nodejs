const cote = require('cote')

const responder = new cote.Responder({ name: 'thumbnail creation responder' })

responder.on('create', (req, done) => {
  const resultado = ''
  done(null, resultado)
})
