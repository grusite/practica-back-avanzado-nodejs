const cote = require('cote')
const Jimp = require('jimp')

const responder = new cote.Responder({ name: 'thumbnail creation responder' })

responder.on('create', (req, done) => {
  Jimp.read(req.file)
    .then(file => {
      return file
        .resize(100, 100) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(`../public/images/${req.fileName.split('.')[0]}_thumbnail.jpg`) // save
    })
    .catch(err => {
      console.log(err)
    })
  done(null, { success: true, result: 'Img in thumbnail saved' })
})
