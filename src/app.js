const express = require('express')
const { json } = require('body-parser')
const compression = require('compression')

const {
    apiLogger,
    errorHandler
} = require('./middlewares/index')

const appRoutes = require('./routes/appRoutes')

const { wrapAction } = require('./helpers/express')
const NotFoundError = require('./Errors/NotFound')

const app = express()

app.use(json());
app.use(compression())

app.use(appRoutes);

const notFoundResponse = () => {
    throw new NotFoundError('url')
}

/* app.all('*', apiLogger, wrapAction(notFoundResponse))

app.use(errorHandler) */

module.exports = app