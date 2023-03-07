// import model
import User from '../models/user.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// other dependencies
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../../utils/sendEmail.js'
import { confirmEmail, forgotMessage } from '../../utils/emailTemplates.js'
import 'dotenv/config'

import { uuidv4 } from '@firebase/util'
import { UNVERIFIED, VERIFIED } from '../constants/index.js'

//  -----PUBLIC CONTROLLERS-----  //

export const register = async (req, res, next) => {
  const { username, email, password } = req.body

  const user = await User.findOne({ email })

  if (user) {
    next(new ErrorCreator('user already exists', 409))
  }

  // Generar el código
  const code = uuidv4()

  User.create({
    username,
    email,
    password,
    code
  })
    .then(async (newUser) => {
      // token data
      const userForToken = {
        email: newUser.email,
        id: newUser._id,
        code: newUser.code
      }

      // creating token
      const token = jwt.sign(userForToken, process.env.SECRET_WORD)

      // Obtener un template
      const template = confirmEmail(username, token)

      // Enviar el email
      const result = await sendEmail({
        to: newUser.email,
        subject: 'Confirmation Email',
        text: template
      })

      if (result) {
        res.send(new ResponseCreator(`An email was sended to ${newUser.email}`, 201, {}))
      }
    }).catch(err => {
      console.error('ERROR: AUTHCONTROLLER(REGISTER)')
      next(err)
    })
}

export const confirmationSender = async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  // bad request
  if (!user) {
    return next(new ErrorCreator('invalid user or password', 401))
  }

  // token data
  const userForToken = {
    email: user.email,
    id: user._id,
    code: user.code
  }

  // creating token
  const token = jwt.sign(userForToken, process.env.SECRET_WORD)

  // Obtener un template
  const template = confirmEmail(user.username, token)

  // Enviar el email
  const result = await sendEmail({
    to: user.email,
    subject: 'Confirmation Email',
    text: template
  })

  if (result) {
    res.send(new ResponseCreator(`An email was sended to ${user.email}`, 200, {}))
  }
}

export const confirm = async (req, res, next) => {
  try {
    // Obtener el token
    const { token } = req.params

    // Verificar la data
    const decodedData = jwt.verify(token, process.env.SECRET_WORD)

    if (decodedData === null) {
      return next(new ErrorCreator('Error al obtener data', 404))
    }

    const { email, code } = decodedData

    // Verificar existencia del usuario
    const user = await User.findOne({ email }) || null

    if (user === null) {
      return next(new ErrorCreator('Usuario no existe', 404))
    }

    // Verificar el código
    if (code !== user.code) {
      return res.redirect(`${process.env.CLIENT_URL}/email-confirmation/true`)
    }

    // Actualizar usuario
    user.status = VERIFIED
    await user.save()

    // Redireccionar a la confirmación
    return res.redirect(`${process.env.CLIENT_URL}/`)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // bad request
  if (!(user && await user.matchPassword(password))) {
    return next(new ErrorCreator('invalid user or password', 401))
  } else {
    // Verificar el status
    if (user.status === UNVERIFIED) {
      return next(new ErrorCreator('user email not validated', 301))
    }

    // token data
    const userForToken = {
      id: user._id
    }

    // creating token
    const token = jwt.sign(userForToken, process.env.SECRET_WORD)

    res.send(new ResponseCreator('Login Successfully', 200, { token, user }))
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) { return next(new ErrorCreator('Please enter your email', 400)) }

    const user = await User.findOne({ email })
    if (!user) { return next(new ErrorCreator('No email could not be send', 404)) }

    const resetToken = user.getResetPasswordToken()
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    const message = forgotMessage(resetUrl, user)

    const result = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    })

    if (result) {
      res.send(new ResponseCreator(`An email has been sent to ${email} with further instructions.`, 200, {}))
    }
  } catch (err) {
    console.error('ERROR: AUTHCONTROLLER(ForgotPassword)')
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { password, resetToken } = req.body

    if (!resetToken || !password) { return next(new ErrorCreator('Invalid Request', 400)) }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) { return next(new ErrorCreator('Invalid Token or Expired', 400)) }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.send(new ResponseCreator('Password has been reset', 200, {}))
  } catch (err) {
    console.error('ERROR: AUTHCONTROLLER(resetPassword)')
    next(err)
  }
}
