const { Router } = require('express');

const transactionRouter = require('./transaction');
const { apiLogger } = require('../middlewares');

const router = Router()

router.use(apiLogger, transactionRouter);

module.exports = router