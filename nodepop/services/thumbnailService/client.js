const cote = require('cote')

const requester = new cote.Requester({ name: 'thumbnail creation requester' })

const request = { type: 'create', file: '' }

requester.send(request, (err, res) => {
  console.log(res)
})
