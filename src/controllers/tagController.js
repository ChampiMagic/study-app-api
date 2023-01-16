// import model
import User from "../models/user.js";

// import constructors
import { ErrorCreator, ResponseCreator } from "../../utils/responseCreator.js";

export const crateTag = async (req, res, next) => {
  const newTag = { name: req.body.name };
  try {
    const user = await User.findByIdAndUpdate(req.userData.id, { $push: { tags: newTag } }, { new: true });
    if (!user) return next(new ErrorCreator('User Not Found', 404));
    res(new ResponseCreator('Successfully created new Tag', 200, {user}));
  } catch (err) {
    console.log("ERROR: PROYECTCONTROLLER(createTag)");
    next(err);
  }
};
