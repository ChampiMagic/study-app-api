// import other dependencies
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// import constructor
import { ErrorCreator } from '../../utils/responseCreator.js'

export const protect = (req, res, next) => {
  const { authorization } = req.headers

  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodeToken = jwt.verify(token, process.env.SECRET_WORD)

  if (!token || !decodeToken.id) {
    next(new ErrorCreator('token is missing or invalid', 401))
  }

  req.userData = {
    id: decodeToken.id
  }

  next()
}
