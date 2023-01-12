// import model
import User from '../models/user.js'
import Proyect from '../models/project.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// Others imports
import { defaultBoxes } from '../../utils/defaultBoxes.js'

//  -----PRIVATE CONTROLLERS-----  //

export const createProyect = async (req, res, next) => {
  const { name, tag } = req.body

  const user = await User.findById(req.userData.id)

  if (!user) {
    next(new ErrorCreator('User not found', 404))
  }

  Proyect.create({
    name,
    tag,
    boxes: defaultBoxes
  })
    .then(async newProyect => {
      // Add new proyect to user
      user.projects.push(newProyect)
      await user.save()

      const updatedUser = await User.findById(req.userData.id).populate({ path: 'projects', model: 'Project', transform: (doc) => { return doc.toObject() } })

      res.send(new ResponseCreator('Proyect created Successfully', 201, { user: updatedUser }))
    }).catch(err => {
      console.error('ERROR: PROYECTCONTROLLER(CREATE)')
      next(err)
    })
}
