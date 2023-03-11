// import model
import Card from './../models/card.js'
import Project from '../models/project.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// Utils imports
import { getDate } from '../../utils/dateManager.js'

// OpenAi imports
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

//  -----PRIVATE CONTROLLERS-----  //
export const createCard = async (req, res, next) => {
  const { question, answer, projectId } = req.body
  try {
    const project = await Project.findById(projectId)
    if (!project) {
      return next(new ErrorCreator('project Not Found', 404))
    }
    const currentBox = project.boxes[0]._id
    const nextBox = project.boxes[1]._id
    const movedOn = getDate(0)

    const newCard = await Card.create({ question, answer, currentBox, nextBox, movedOn })

    project.boxes[0].cards.push(newCard.id)
    await project.save()

    const currentProject = await Project.findById(projectId)
      .populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
      .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })
    return res.send(new ResponseCreator('success', 200, { project: currentProject, card: newCard }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(createCard)')
    next(err)
  }
}

export const moveCard = async (req, res, next) => {
  const { cardId, projectId, isCorrect } = req.body

  try {
    const project = await Project.findById(projectId)
      .populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
      .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

    if (!project) {
      return next(new ErrorCreator('Project Not Found', 404))
    }

    const card = await Card.findById(cardId)

    if (!card) {
      return next(new ErrorCreator('Card Not Found', 404))
    }

    if (isCorrect) {
      // Card finished
      if (card.nextBox === '0') {
        // IsEmpty verification and remove card
        project.boxes.forEach((b) => {
          if (b._id.toString() === card.currentBox) {
          // Check if the cardId exists in the current box
            const cardIndex = b.cards.findIndex(card => card._id.toString() === cardId)
            console.log(b)
            if (cardIndex === -1) return next(new ErrorCreator('Card Not Found in current Box', 404))

            b.cards.splice(cardIndex, 1)

            if (!b.cards.length) b.isEmpty = true
          }
        })

        project.completeBox.push(cardId)

        card.currentBox = '0'
        await card.save()

        await project.save()
        const currentProject = await Project.findById(projectId)
          .populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
          .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

        return res.send(new ResponseCreator('Card Completed', 200, { project: currentProject }))
      }
      // Check if the current and new boxId exist in the boxes array
      const currentBoxIndex = project.boxes.findIndex(box => box._id.toString() === card.currentBox)
      if (currentBoxIndex === -1) return next(new ErrorCreator('Current Box Not Found', 404))
      const newBoxIndex = project.boxes.findIndex(box => box._id.toString() === card.nextBox)
      if (newBoxIndex === -1) return next(new ErrorCreator('New Box Not Found', 404))

      // Check if the cardId is already in the new box
      const findCard = project.boxes[newBoxIndex].cards.find(card => card._id.toString() === cardId)
      if (findCard) return next(new ErrorCreator('Card already in next Box', 400))

      // Check if the cardId exists in the current box
      const cardIndex = project.boxes[currentBoxIndex].cards.findIndex(card => card._id.toString() === cardId)
      if (cardIndex === -1) return next(new ErrorCreator('Card Not Found in current Box', 404))

      // remove and move card
      project.boxes[currentBoxIndex].cards.splice(cardIndex, 1)
      project.boxes[newBoxIndex].cards.push(cardId)

      // IsEmpty verification
      project.boxes = project.boxes.map(b => {
        if (!b.cards.length) {
          b.isEmpty = true
          return b
        } else {
          let isEmpty = true
          b.cards.forEach(c => {
            if (c.isReady()) isEmpty = false
          })

          b.isEmpty = isEmpty
          return b
        }
      })
      console.log(project)
      // New next and current box for card model
      card.currentBox = card.nextBox
      if (project.boxes[newBoxIndex + 1] === undefined) {
        card.nextBox = '0'
      } else {
        card.nextBox = project.boxes[newBoxIndex + 1]._id
      }

      // Updating card Time
      card.movedOn = getDate(newBoxIndex)

      await card.save()
      await project.save()
      const currentProject = await Project.findById(projectId)
        .populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
        .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

      res.send(new ResponseCreator('Successfully moved card', 200, { project: currentProject }))
    } else {
      // Check if the current exist in the boxes array
      const currentBoxIndex = project.boxes.findIndex(box => box._id.toString() === card.currentBox)
      if (currentBoxIndex === -1) return next(new ErrorCreator('Current Box Not Found', 404))

      // Check if the cardId exists in the current box
      const cardIndex = project.boxes[currentBoxIndex].cards.findIndex(card => card._id.toString() === cardId)
      if (cardIndex === -1) return next(new ErrorCreator('Card Not Found in current Box', 404))

      // remove and move card
      project.boxes[currentBoxIndex].cards.splice(cardIndex, 1)
      project.boxes[0].cards.push(cardId)

      // IsEmpty verification
      project.boxes = project.boxes.map(b => {
        if (!b.cards.length) {
          b.isEmpty = true
          return b
        } else {
          let isEmpty = true
          b.cards.forEach(c => {
            if (c.isReady()) isEmpty = false
          })

          b.isEmpty = isEmpty
          return b
        }
      })

      // New next and current box for card model
      card.currentBox = project.boxes[0]._id
      card.nextBox = project.boxes[1]._id

      // Updating card Time
      card.movedOn = getDate(0)

      await card.save()
      await project.save()
      const currentProject = await Project.findById(projectId)
        .populate({ path: 'tag', model: 'Tag', transform: (doc, id) => { return doc == null ? id : doc } })
        .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

      res.send(new ResponseCreator('Successfully moved card', 200, { project: currentProject }))
    }
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(moveCard)', err)
    next(err)
  }
}

export const updateCard = async (req, res, next) => {
  const { _id, question, answer } = req.body
  try {
    const card = await Card.findById(_id)
    if (!card) return next(new ErrorCreator('Card Not Found', 404))

    // update and save
    card.answer = answer
    card.question = question
    await card.save()

    res.send(new ResponseCreator('Successfully Card updated', 200, { card }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(updateCard)')
    next(err)
  }
}

export const randomCard = async (req, res, next) => {
  const { projectId, box } = req.query
  try {
    const project = await Project.findById(projectId).populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

    if (!project) return next(new ErrorCreator('Project Not Found', 404))

    const actualBox = project.boxes[box]
    if (!actualBox.cards.length) return next(new ErrorCreator('Box is empty', 404))

    const currentTime = new Date()

    actualBox.cards = actualBox.cards.filter((c) => c.movedOn <= currentTime)

    const randomCard = actualBox.cards[Math.floor(Math.random() * actualBox.cards.length)]

    res.send(new ResponseCreator('Successfully', 200, { card: randomCard }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(randomCard)')
    next(err)
  }
}

export const getAllCards = async (req, res, next) => {
  const { projectId } = req.query
  try {
    console.log(1)
    const project = await Project.findById(projectId)
      .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })
      .populate({ path: 'completeBox', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })
    console.log(project)
    if (!project) return next(new ErrorCreator('Project Not Found', 404))

    let allCards = [...project.completeBox]
    project.boxes.forEach((b) => {
      allCards = [...allCards, ...b.cards]
    })

    res.send(new ResponseCreator('Successfully', 200, { cards: allCards }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(getAllCards)')
    next(err)
  }
}

export const getCardByName = async (req, res, next) => {
  const { projectId, question } = req.query
  try {
    const project = await Project.findById(projectId).populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })

    if (!project) return next(new ErrorCreator('Project Not Found', 404))

    let searchCards = []

    if (question === 'null') {
      project.boxes.forEach((b) => {
        searchCards = [...searchCards, ...b.cards]
      })
    } else {
      project.boxes.forEach((b) => {
        b.cards.forEach((c) => {
          if (c) {
            console.log(c.question.toLowerCase().includes(question.toLowerCase()))
            if (c.question.toLowerCase().includes(question.toLowerCase())) searchCards.push(c)
          }
        })
      })
    }

    res.send(new ResponseCreator('Successfully', 200, { cards: searchCards }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(getCardByName)')
    next(err)
  }
}

export const deleteCard = async (req, res, next) => {
  const { cardId, projectId } = req.query
  try {
    const project = await Project.findById(projectId)

    project.boxes.forEach((b) => {
      b.cards.pull(cardId)
    })

    project.save()

    await Card.findByIdAndDelete(cardId)
    const currentProject = await Project.findById(projectId)
      .populate({ path: 'boxes.cards', model: 'Card', transform: (doc, id) => { return doc == null ? id : doc } })
    let cards = []

    currentProject.boxes.forEach(box => {
      cards = [...box.cards, ...cards]
    })
    res.send(new ResponseCreator('Successfully Card Deleted', 200, { cards }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(deleteCard)')
    next(err)
  }
}

export const verifyAnswer = async (req, res, next) => {
  const { answer1, answer2 } = req.query

  if (!answer1 || !answer2) {
    return next(new ErrorCreator('Data missing', 400))
  }

  try {
    const prompt = `Answer1:${answer1} Answer2:${answer2} .Is Answer1 similar to Answer2 ? only response True or False.`

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 7,
      temperature: 0
    })

    const isCorrect = response.data.choices[0].text.toLowerCase().includes('true')

    console.log('IsCorrect ', isCorrect)
    res.send(new ResponseCreator('Card Verified', 200, { isCorrect }))
  } catch (err) {
    console.error('ERROR: CARDCONTROLLER(verifyCard)')
    console.log(err.response)
    next(err)
  }
}
