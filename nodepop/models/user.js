const mongoose = require('mongoose')
const { pick } = require('lodash')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 12

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      requird: true,
    },
  },
  { timestamps: true }
)

schema.methods.toPublic = function() {
  return pick(this, ['name', 'email'])
}

schema.pre('save', async function() {
  // generate a salt
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

  // hash the password using our new salt
  const hash = await bcrypt.hash(this.password, salt)

  // override the cleartext password with the hashed one
  this.password = hash
})

schema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('user', schema)
