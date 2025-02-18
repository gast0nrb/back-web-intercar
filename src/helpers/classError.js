class GeneralError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}

module.exports = {
    GeneralError,
    BadRequest,
    NotFound
}