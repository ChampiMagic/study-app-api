// import model
import User from '../models/user.js'

// import constructors
import { ErrorCreator, ResponseCreator } from '../../utils/responseCreator.js'

// other dependencies
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../../utils/sendEmail.js'
import { forgotMessage } from '../../utils/emailTemplates.js'
import 'dotenv/config'

//  -----PUBLIC CONTROLLERS-----  //

export const register = async (req, res, next) => {
  const { username, email, password } = req.body

  const user = await User.findOne({ email })

  if (user) {
    next(new ErrorCreator('user already exists', 409))
  }

  User.create({
    username,
    email,
    password
  })
    .then(newUser => {
      // token data
      const userForToken = {
        id: newUser._id
      }

      // creating token
      const token = jwt.sign(userForToken, process.env.SECRET_WORD)

      res.send(new ResponseCreator('Register Successfully', 201, { token, user: newUser }))
    }).catch(err => {
      console.error('ERROR: AUTHCONTROLLER(REGISTER)')
      next(err)
    })
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // bad request
  if (!(user && await user.matchPassword(password))) {
    next(new ErrorCreator('invalid user or password', 401))
  } else {
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

    const resetUrl = `${process.env.VERIFICATIONLINK}/${resetToken}`
    const message = forgotMessage(resetUrl, user)

    const result = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    })

    console.log(7)
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
