import mongoose from 'mongoose';
import 'dotenv/config';


const connectionString = process.env.DB_GETWAY || null;


mongoose.connect(connectionString)
    .then(() => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.error('error connection to MongoDB', error.message)
    })
