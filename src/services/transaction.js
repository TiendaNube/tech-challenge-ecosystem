const { models } = require('../database')
const transactionTransform = require('../transforms/transactions')
const merchantService = require('./merchant')
const { createPayable } = require('./payable')
const InvalidError = require('../Errors/Invalid')

module.exports.createTransaction = async (body) => {
    const { merchantId } = body

    const merchant = await merchantService.findMerchant(merchantId)

    if (!merchant) {
        throw new InvalidError('MerchantId')
    }

    const payload = transactionTransform(body)

    const transaction = await models.transactions.create(
        payload
    );
    // In the future, that could be a routine just to create payables
    await createPayable(transaction)


    return transaction
}