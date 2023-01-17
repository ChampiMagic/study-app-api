// import model
import Card from "./../models/card.js";
import Project from "../models/project.js";

// import constructors
import { ErrorCreator, ResponseCreator } from "../../utils/responseCreator.js";

// other dependencies

//  -----PRIVATE CONTROLLERS-----  //
export const createCard = async (req, res, next) => {
  const { question, answer, projectId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorCreator("project Not Found", 404));
    }
    const newCard = await Card.create({ question, answer });
    project.boxes[0].cards.push(newCard.id);
    await project.save();
    return res.send(new ResponseCreator("success", 200, { project, card: newCard}));
  } catch (err) {
    console.error("ERROR: CARDCONTROLLER(createCard)");
    next(err);
  }
};

export const moveCard = async (req, res, next) => {
  const { cardId, projectId, currentBoxId, newBoxId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorCreator('Project Not Found', 404));
    }

    // Check if the current and new boxId exist in the boxes array
    const currentBoxIndex = project.boxes.findIndex(box => box._id.toString() === currentBoxId);
    if(currentBoxIndex === -1) return next(new ErrorCreator('Current Box Not Found', 404));
    const newBoxIndex = project.boxes.findIndex(box => box._id.toString() === newBoxId);
    if(newBoxIndex === -1) return next(new ErrorCreator('New Box Not Found', 404));

    // Check if the cardId is already in the new box
    const findCard = project.boxes[newBoxIndex].cards.find(card => card._id.toString() === cardId);
    if(findCard) return next(new ErrorCreator('Card already in new Box', 404));

    // Check if the cardId exists in the current box
    const cardIndex = project.boxes[currentBoxIndex].cards.findIndex(card => card._id.toString() === cardId);
    if(cardIndex === -1) return next(new ErrorCreator('Card Not Found in current Box', 404));

    //remove and move card
    project.boxes[currentBoxIndex].cards.splice(cardIndex, 1);
    project.boxes[newBoxIndex].cards.push(cardId);

    await project.save();
    await project.populate({path: 'boxes.cards', model: 'Card'});
    
    res.send(new ResponseCreator('Successfully moved card', 200, { project }));
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(moveCard)', err);
    next(err);
  }
};

export const updateCard = async (req, res, next) => {
  const { id, question, answer } = req.body;
  try {
    const card = await Card.findById(id);
    if (!card) return next(new ErrorCreator("Card Not Found", 404));

    //update and save
    card.answer = answer;
    card.question = question;
    await card.save();

    res.send(new ResponseCreator("Successfully Card updated", 200, { card }));
  } catch (err) {
    console.error("ERROR: CARDCONTROLLER(updateCard)");
    next(err);
  }
};
