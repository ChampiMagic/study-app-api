// import model
import User from '../models/user.js'
import Project from '../models/project.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// Others imports
import { defaultBoxes } from '../../utils/defaultBoxes.js'

//  -----PRIVATE CONTROLLERS-----  //

export const createProject = async (req, res, next) => {
  const project = {name: req.body.name, tag: req.body.tag, boxes: defaultBoxes}

  const user = await User.findById(req.userData.id)

  if (!user) {
   return next(new ErrorCreator('User not found', 404))
  }

  Project.create(project)
    .then(async newProject => {
      // Add new project to user
      user.projects.push(newProject._id)
      await user.save()
      res.send(new ResponseCreator('Project created Successfully', 201, { project: newProject }))
    }).catch(err => {
      console.error('ERROR: PROJECTCONTROLLER(CREATE)')
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
      let projects = await Project.find({ _id: { $in: user.projects } });
      return res.send(new ResponseCreator("page or limit is null", 200, { count: projects.length, projects }));
    }

    const totalPages = Math.ceil(await Project.countDocuments({ _id: { $in: user.projects } }) / limit);

    let projects = await Project.find({ _id: { $in: user.projects } })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    res.send(new ResponseCreator("success", 200, {totalPages, count: projects.length, projects }));
  } catch (err) {
    console.error("ERROR: PROJECTCONTROLLER(getAllProjects)");
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate({model: 'Card', path: 'boxes.cards',transform: (doc,id) => doc ? doc.toObject() : id})
    if (!project) {
      return next(new ErrorCreator("Project not found", 404));
    }
    res.send(new ResponseCreator("project found successfully", 200, { project }));
  } catch (err) {
    console.error("ERROR: PROJECTCONTROLLER(getProjectById)");
    next(err);
  }
};