const { models } = require('../database')
const transactionTransform = require('../transforms/transactions')

module.exports.createTransaction = async (body) => {
    const payload = transactionTransform(body)
    console.log("🚀 ~ module.exports.createTransaction= ~ payload:", payload)
    const transaction = await models.transactions.create(
        payload
    );

    return transaction
}