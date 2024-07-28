const log4js = require('log4js')

const BaseError = require('./BaseError')
const { internalError } = require('../config/errorCodes')

const apiLogger = log4js.getLogger('api')

class InternalError extends BaseError {
    constructor(err, requestId) {
        super(500, internalError, 'http.500')

        apiLogger.error({
            message: err.message,
            requestId,
            stackTrace: err.stack,
        })
    }
}

module.exports = InternalError