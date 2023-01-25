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

    res.send(new ResponseCreator('Successfully created new Tag', 200, { tag: newTag }))
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

export const getTagsByName = async (req, res, next) => {
  const { name } = req.params
  try {
    const user = await User.findById(req.userData.id)
    if (!user) return next(new ErrorCreator('User Not Found', 404))
    const tags = await Tag.find({ _id: { $in: user.tags } })

    if (name === 'null') return res.send(new ResponseCreator('success', 200, { tags }))

    // filter tags
    const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(name.toLowerCase()))

    if (!filteredTags.length) return next(new ErrorCreator('Tag Not Found', 404))

    res.send(new ResponseCreator('Successfully fetched all Tags', 200, { tags: filteredTags }))
  } catch (err) {
    console.log('ERROR: TAGCONTROLLER(getTagsByName)')
    next(err)
  }
}

export const updateTag = async (req, res, next) => {
  const { name, tagId } = req.body
  try {
    const tag = await Tag.findById(tagId)
    if (!tag) return next(new ErrorCreator('Tag Not Found', 404))

    // update tag
    tag.name = name
    await tag.save()

    res.send(new ResponseCreator('Successfully Tag updated', 200, { tag }))
  } catch (err) {
    console.log('ERROR: TAGCONTROLLER(updateTag)')
    next(err)
  }
}

export const deleteTag = async (req, res, next) => {
  const { tagId } = req.params
  try {
    await Tag.findByIdAndDelete(tagId)

    res.send(new ResponseCreator('Successfully Tag deleted', 200, { }))
  } catch (err) {
    console.log('ERROR: TAGCONTROLLER(deleteTag)')
    next(err)
  }
}
