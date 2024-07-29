const { Router } = require('express');

const transactionRouter = require('./transaction');
const merchantRouter = require('./merchant')

const { apiLogger } = require('../middlewares');

const router = Router()

router.use(apiLogger, transactionRouter);
router.use(apiLogger, merchantRouter);

module.exports = router