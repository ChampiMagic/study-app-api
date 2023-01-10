import mongoose from "mongoose";
const { Schema, model } = mongoose
import mongooseUniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
   question: {
    type: String,
    required: true
   },
   answer: {
    type: String,
    required: true
   }
},{
    versionKey: false 
})

schema.plugin(mongooseUniqueValidator);

export default model('Card', schema)