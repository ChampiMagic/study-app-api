import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: true
  }
}, {
  versionKey: false
})

schema.plugin(mongooseUniqueValidator)

export default model('Tag', schema)
