import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const schema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  movedOn: {
    type: Date,
    required: true
  },
  currentBox: {
    type: String,
    required: true
  },
  nextBox: {
    type: String,
    required: true
  }
}, {
  versionKey: false
})

schema.plugin(mongooseUniqueValidator)

// methods
schema.methods.isReady = function () {
  const currentDate = new Date()
  return this.movedOn <= currentDate
}

export default model('Card', schema)
