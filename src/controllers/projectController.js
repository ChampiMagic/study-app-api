// import model
import User from '../models/user.js'
import Project from '../models/project.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// Others imports
import { defaultBoxes } from '../../utils/defaultBoxes.js'

//  -----PRIVATE CONTROLLERS-----  //

export const createProject = async (req, res, next) => {
  const project = { name: req.body.name, tag: req.body.tag, boxes: defaultBoxes }

  const user = await User.findById(req.userData.id)

  if (!user) {
    return next(new ErrorCreator('User not found', 404))
  }

  Project.create(project)
    .then(async newProject => {
      // Add new project to user

      user.projects.push(newProject._id)
      await user.save()

      const populatedProject = await Project.findById(newProject._id).populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })

      res.send(new ResponseCreator('Project created Successfully', 201, { project: populatedProject }))
    }).catch(err => {
      console.error('ERROR: PROJECTCONTROLLER(CREATE)')
      next(err)
    })
}

export const getAllProjects = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.id)

    const projects = await Project.find({ _id: { $in: user.projects } }).populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })

    res.send(new ResponseCreator('success', 200, { projects }))
  } catch (err) {
    console.error('ERROR: PROJECTCONTROLLER(getAllProjects)')
    next(err)
  }
}

export const getProjectById = async (req, res, next) => {
  const { id } = req.params
  try {
    const project = await Project.findById(id).populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
    if (!project) {
      return next(new ErrorCreator('Project not found', 404))
    }
    res.send(new ResponseCreator('project found successfully', 200, { project }))
  } catch (err) {
    console.error('ERROR: PROJECTCONTROLLER(getProjectById)')
    next(err)
  }
}

export const getProjectsByName = async (req, res, next) => {
  const { name } = req.params
  try {
    const user = await User.findById(req.userData.id)

    if (!user) {
      return next(new ErrorCreator('User not found', 404))
    }

    const projects = await Project.find({ _id: { $in: user.projects } }).populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })

    if (name === 'null') return res.send(new ResponseCreator('success', 200, { projects }))

    // Filter projects by name
    const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(name.toLowerCase()))

    res.send(new ResponseCreator('success', 200, { projects: filteredProjects }))
  } catch (err) {
    console.error('ERROR: PROJECTCONTROLLER(getProjectsByName)')
    next(err)
  }
}

export const deleteProject = async (req, res, next) => {
  const { projectId } = req.params
  try {
    const user = await User.findById(req.userData.id)

    user.projects.pull(projectId)

    user.save()

    await Project.findByIdAndDelete(projectId)

    res.send(new ResponseCreator('success', 200, {}))
  } catch (err) {
    console.error('ERROR: PROJECTCONTROLLER(deleteProject)')
    next(err)
  }
}

export const updateProject = async (req, res, next) => {
  const { projectId, name, tag } = req.body
  console.log(req.body)
  const updatedProject = await Project.findByIdAndUpdate(projectId, { name, tag })

  if (!updatedProject) {
    return next(new ErrorCreator('Project not found', 404))
  }
  try {
    const populatedProject = await Project.findById(projectId).populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })

    res.send(new ResponseCreator('Project updated Successfully', 201, { project: populatedProject }))
  } catch (err) {
    console.error('ERROR: PROJECTCONTROLLER(CREATE)')
    next(err)
  }
}
