const { models } = require('../database')
const merchantTransform = require('../transforms/merchant')

module.exports.findMerchant = async (merchantId) => {
    const merchant = await models.merchants.findByPk(merchantId)

    return merchant
} 