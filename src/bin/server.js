const log4js = require('log4js')
const app = require('../app')
require('dotenv').config()

const logger = log4js.getLogger('api')

const {
    PORT = 3000
} = process.env

const start = async() => {
    app.listen(PORT, ()=>{
        logger.debug(`Server is running on port ${PORT}`)
    })
}

start()