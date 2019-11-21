const cote = require('cote')
const Jimp = require('jimp')
const exceptionPool = require('../../lib/exceptionPool')

const responder = new cote.Responder({ name: 'thumbnail creation responder' })

responder.on('create', (req, done) => {
  Jimp.read(req.file, (err, file) => {
    if (err) throw new exceptionPool.ImgError()
    file
      .resize(100, 100) // resize
      .write(`/images/${file}_thumbnail.jpg`) // save
  })
  done(null, { success: true, result: 'Img in thumbnail saved' })
})

module.exports = responder
