const log4js = require('log4js')
const app = require('../app')
const database = require('../database')
require('dotenv').config()

const logger = log4js.getLogger('api')

const {
    PORT = 3000
} = process.env

const start = async () => {
    await database.connect(logger)

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

start()