import mongoose from "mongoose";
const { Schema, model } = mongoose
import mongooseUniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: false
    },
    boxes: [
        {
            type: [Schema.Types.ObjectId],
            ref: 'Box'
        }
    ]
},{
    versionKey: false 
})

schema.plugin(mongooseUniqueValidator);

export default model('Project', schema)