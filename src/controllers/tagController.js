// import model
import User from "../models/user.js";
import Tag from '../models/Tag.js';
// import constructors
import { ErrorCreator, ResponseCreator } from "../../utils/responseCreator.js";

export const crateTag = async (req, res, next) => {
  const tag = {name: req.body.name}
  try {
    const user = await User.findById(req.userData.id);
    if (!user) return next(new ErrorCreator("User Not Found", 404));

    //create tag
    const newTag = await Tag.create(tag);

    //udpate user
    user.tags.push(newTag);
    await user.save();

    res.send(new ResponseCreator("Successfully created new Tag", 200, { user, tag: newTag }));
  } catch (err) {
    console.log("ERROR: PROYECTCONTROLLER(createTag)");
    next(err);
  }
};