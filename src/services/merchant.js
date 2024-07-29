const { models } = require('../database')
const merchantTransform = require('../transforms/merchant')

module.exports.findMerchant = async (merchantId) => {
    const merchant = await models.merchants.findByPk(merchantId)

    return merchant
}

module.exports.findRecivables = async (merchantId) => {
    const allReceivables = await models.payables.findAll({
        merchant_id: merchantId
    })
    const summary = {
        payablesPaid: 0,
        feeCharge: 0,
        payablesToPay: 0
    }

    allReceivables.forEach(payable => {
        if (payable.status === 'paid') {
            summary.payablesPaid += parseFloat(payable.amount);
            summary.feeCharge += parseFloat(payable.fee);
        } else if (payable.status === 'waiting_funds') {
            summary.payablesToPay += parseFloat(payable.amount);
        }
    })

    return summary;
}