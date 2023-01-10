//import model
import User from "../models/user.js";

//import constructors
import { errorCreator, ResponseCreator } from '../../utils/responseCreator.js'

//other dependencies
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import 'dotenv/config';



//  -----PUBLIC CONTROLLERS-----  //

export const register = async (req, res, next) => {

    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (user) {
        next(new errorCreator('user already exists', 409))
    }

    //password encryption
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
     

    User.create({
        username,
        passwordHash,
    })
    .then(newUser => {

        //token data
        const userForToken = {
            _id: newUser._id,
            isStudent: newUser.isStudent
        }

        //creating token
        const token = jwt.sign(userForToken, process.env.SECRET_WORD)
         
         res.send(new ResponseCreator('Register Successfully', 201, {token, user: newUser}))


    }).catch(err => {

        console.error("ERROR: AUTHCONTROLLER(REGISTER)")
        next(err)
    })
}


export const login = async (req, res, next) => {

    const { username, password } = req.body;
    
    const user = await User.findOne({ username })

    //user verification
    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash)

   
    //bad request    
    if(!(user && passwordCorrect)) {
        next(new errorCreator('invalid user or password', 401))

    } else {

        //token data
        const userForToken = {
            _id: user._id,
            isStudent: user.isStudent
        }

        //creating token
        const token = jwt.sign(userForToken, process.env.SECRET_WORD)

        res.send(new ResponseCreator('Login Successfully', 200, {token, user}))
    
        }

   
}