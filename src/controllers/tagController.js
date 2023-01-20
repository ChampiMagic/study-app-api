// import model
import User from '../models/user.js'
import Tag from '../models/Tag.js'
// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

export const createTag = async (req, res, next) => {
  const tag = { name: req.body.name }
  try {
    const user = await User.findById(req.userData.id)
    if (!user) return next(new ErrorCreator('User Not Found', 404))

    // create tag
    const newTag = await Tag.create(tag)

    // udpate user
    user.tags.push(newTag._id)
    await user.save()

    res.send(new ResponseCreator('Successfully created new Tag', 200, { user, tag: newTag }))
  } catch (err) {
    console.log('ERROR: TAGCONTROLLER(createTag)')
    next(err)
  }
}

export const getTags = async (req, res, next) => {
  try {
    // populate tags
    const user = await User.findById(req.userData.id)
    if (!user) return next(new ErrorCreator('User Not Found', 404))
    const tags = await Tag.find({ _id: { $in: user.tags } })

    res.send(new ResponseCreator('Successfully fetched all Tags', 200, { tags }))
  } catch (err) {
    console.log('ERROR: TAGCONTROLLER(getTags)')
    next(err)
  }
}
