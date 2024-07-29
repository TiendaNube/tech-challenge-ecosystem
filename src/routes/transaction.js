const { Router } = require('express')

const { wrapAction } = require('../helpers/express')
const { createTransaction } = require('../controller/transaction')

const {
    validate
} = require('../middlewares')

const {
    transaction
} = require('../validator/transaction')

const router = Router()

router.post(
    '/transaction',
    validate(transaction),
    wrapAction(createTransaction)
)

module.exports = router