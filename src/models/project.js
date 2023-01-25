import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  },
  boxes: [
    {
      isEmpty: {
        type: Boolean,
        default: true
      },
      cards: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Card'
        }
      ]
    }
  ]
}, {
  versionKey: false
})

schema.plugin(mongooseUniqueValidator)

export default model('Project', schema)
