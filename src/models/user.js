import mongoose from "mongoose";
const { Schema, model } = mongoose
import mongooseUniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 8
    },
    avatar: {
        type: String,
        required: false
    },
    projects:[
                {
                    type: [Schema.Types.ObjectId],
                    ref: 'Project'
                }
             ],
},{
    versionKey: false 
})

schema.plugin(mongooseUniqueValidator);

schema.set('toJSON', {
   transform: (document, returnedObject) => {

    //we dont send the user password
    delete returnedObject.passwordHash

   }
})


export default model('User', schema)