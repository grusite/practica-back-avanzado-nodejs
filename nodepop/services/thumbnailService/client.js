const cote = require('cote')

const requester = new cote.Requester({ name: 'thumbnail creation requester' })

const request = file => ({ type: 'create', file: file })

requester.send(request, (err, res) => {
  console.log(res)
})

module.exports = request
