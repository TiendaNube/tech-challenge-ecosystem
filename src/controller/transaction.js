const transactionService = require('../services/transaction')
const merchantService = require('../services/merchant')
const InvalidError = require('../Errors/Invalid')

module.exports.createTransaction = async ({ body }) => {
    const { merchantId } = body
    console.log("🚀 ~ module.exports.createTransaction= ~ merchantId:", merchantId)

    const merchant = await merchantService.findMerchant(merchantId)

    if(!merchant){
        throw new InvalidError('merchantIdInvalid')
    }

    const transaction = await transactionService.createTransaction(body)
    return {
        body: {
            transaction
        },
        statusCode: 201
    }
}