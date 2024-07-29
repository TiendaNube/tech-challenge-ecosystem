const BaseError = require('../Errors/BaseError')
const InternalError = require('../Errors/Internal')

const normalizeError = (err, requestId) => {
    if (err instanceof BaseError) {
        return err
    }
    console.log(err)
    return new InternalError(err, requestId)
}

module.exports = (err, req, res, next) => {
    const error = normalizeError(err, req.requestId)

    const httpCode = error.getHttpCode()
    const body = error.getBody()
    res.body = body

    res.status(httpCode).send(body)
    next()
}