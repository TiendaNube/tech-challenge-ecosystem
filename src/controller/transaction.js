const transactionService = require('../services/transaction')

module.exports.createTransaction = async ({ body }) => {
    const transaction = await transactionService.createTransaction(body)
    return {
        body: {
            transaction
        },
        statusCode: 201
    }
}