import { ErrorCreator } from '../../utils/responseCreator.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  if (err.code === 11000) {
    const message = 'Campo duplicado, ya existe un registro con ese valor'
    error = new ErrorCreator(message, 400)
  }

  if (err.name === 'CastError') {
    const message = 'Campo invalido'
    error = new ErrorCreator(message, 400)
  }

  if (err.name === 'ValidationError') {
    const { type, path, message } = Object.values(err.errors).map(val => { return { type: val.kind, path: val.path, value: val.value, message: val.message } })[0]

    if (type === 'unique') {
      error = new ErrorCreator(`This ${path} is already registered`, 409)
    } else {
      error = new ErrorCreator(message, 409)
    }
  }

  res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' })
}

export default errorHandler
