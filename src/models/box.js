import mongoose from "mongoose";
const { Schema, model } = mongoose
import mongooseUniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
   name: {
    type: String,
    required: true
   },
   isEmpty: {
    type: Boolean,
    default: true,
   },
   cards: [
        {
            type: [Schema.Types.ObjectId],
            ref: 'Card'
        }
   ]
},{
    versionKey: false 
})

schema.plugin(mongooseUniqueValidator);

export default model('Box', schema)