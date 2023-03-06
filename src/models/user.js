import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { UNVERIFIED } from '../constants/index.js'
const { Schema, model } = mongoose

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  avatar: {
    type: String,
    required: false
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true,
    default: UNVERIFIED
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
}, {
  timestamps: true,
  versionKey: false
})

schema.plugin(mongooseUniqueValidator)

schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// encrypt password before saving into mongoDB
schema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

schema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}
schema.set('toJSON', {
  transform: (document, returnedObject) => {
    // we dont send the user password
    delete returnedObject.passwordHash
  }
})

export default model('User', schema)
