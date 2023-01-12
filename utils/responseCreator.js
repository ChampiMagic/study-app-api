export class ResponseCreator {
  constructor (message, statusCode, body) {
    this.message = message || 'Successful'
    this.statusCode = statusCode
    this.body = body
  }
}

export class ErrorCreator extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}
