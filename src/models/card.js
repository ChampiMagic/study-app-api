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
  }
}, {
  versionKey: false
})

schema.plugin(mongooseUniqueValidator)

export default model('Card', schema)
