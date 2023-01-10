export class ResponseCreator {
    constructor(message, statusCode, body) {
        this.message = message? message : "Successful"
        this.statusCode = statusCode
        this.body = body
    }
}

export class errorCreator extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}
