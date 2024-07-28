const { Router } = require('express')

const { wrapAction } = require('../helpers/express')
const { calculateRecivables } = require('../controller/merchant')

const router = Router()

router.get(
    '/merchant/receivable/:id',
    wrapAction(calculateRecivables)
)

module.exports = router