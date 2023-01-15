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

export const getAllProjects = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const user = await User.findById(req.userData.id);

    if (!user) {
      next(new ErrorCreator("User not found", 404));
    }
    if (!parseInt(page) || !parseInt(limit)) {
      let projects = await Proyect.find({ _id: { $in: user.projects } });
      return res.send(new ResponseCreator("page or limit is null", 200, { count: projects.length, projects }));
    }

    const totalPages = Math.ceil(await Proyect.countDocuments({ _id: { $in: user.projects } }) / limit);

    let projects = await Proyect.find({ _id: { $in: user.projects } })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    res.send(new ResponseCreator("success", 200, {totalPages, count: projects.length, projects }));
  } catch (err) {
    console.error("ERROR: PROYECTCONTROLLER(getAllProjects)");
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Proyect.findById(id).populate({model: 'Card', path: 'boxes.cards',transform: (doc,id) => doc ? doc.toObject() : id})
    if (!project) {
      return next(new ErrorCreator("Project not found", 404));
    }
    res.send(new ResponseCreator("project found successfully", 200, { project }));
  } catch (err) {
    console.error("ERROR: PROYECTCONTROLLER(getProjectById)");
    next(err);
  }
};