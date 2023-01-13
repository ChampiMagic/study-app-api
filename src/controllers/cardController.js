// import model
import Card from "./../models/card.js";
import Project from "../models/project.js";

// import constructors
import { ErrorCreator, ResponseCreator } from "../../utils/responseCreator.js";

// other dependencies

//  -----PRIVATE CONTROLLERS-----  //
export const createCard = async (req, res, next) => {
  const { question, answer, boxId } = req.body;
  try {
    const project = await Project.findOne({ "boxes._id": boxId });
    if (!project) {
      return next(new ErrorCreator("Box Not Found", 404));
    }
    const newCard = await Card.create({ question, answer });
     project.boxes.map((item) => {
      if (item._id == boxId) {
        item.cards.push(newCard)
      }
      return item;
    });
    await project.save();
    return res.send(new ResponseCreator("success", 200, { project, card: newCard}));
  } catch (err) {
    console.error("ERROR: CARDCONTROLLER(createCard)");
    next(err);
  }
};
