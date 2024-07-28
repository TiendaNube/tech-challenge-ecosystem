const { models } = require('../database')
const transactionTransform = require('../transforms/transactions')
const { createPayable } = require('./payable')

module.exports.createTransaction = async (body) => {
    const payload = transactionTransform(body)

    const transaction = await models.transactions.create(
        payload
    );
    // In the future, that could be a routine just to create payables
    await createPayable(transaction)
}