//import model
import User from "../models/user.js";
import Proyect from '../models/project.js'

//import constructors
import { errorCreator, ResponseCreator } from '../../utils/responseCreator.js'


//  -----PRIVATE CONTROLLERS-----  //

export const createProyect = async (req, res, next) => {

    const { name, tag } = req.body

    let user = await User.findById(req.userData.id)

    if (!user) {
        next(new errorCreator('User not found', 404))
    }

    Proyect.create({
        name,
        tag,
    })
    .then(async newProyect => {

        // Add new proyect to user
        user.projects.push(newProyect)
        await user.save()

        const updatedUser =  await User.findById(req.userData.id).populate("projects")
         
        res.send(new ResponseCreator('Proyect created Successfully', 201, {updatedUser}))


    }).catch(err => {

        console.error("ERROR: PROYECTCONTROLLER(CREATE)")
        next(err)
    })
}


export const deleteProyect = async (req, res, next) => {

    const { proyectId } = req.body;
    
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
            id: user._id,
        }

        //creating token
        const token = jwt.sign(userForToken, process.env.SECRET_WORD)

        res.send(new ResponseCreator('Login Successfully', 200, {token, user}))
    
        }

   
}