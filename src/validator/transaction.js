const Joi = require('@hapi/joi')

const merchantIdRule = Joi.string()
const descriptionRule = Joi.string()
const paymentMethodRule = Joi.string()
const cardNumberRule = Joi.string().max(16)
const cardHolderRule = Joi.string()
const cardExpirationRule = Joi.string().pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4})$/, 'MM/YY')
const cardCvvRule = Joi.string().max(3)
const amountRule = Joi.string().pattern(/^\d{1,8}(\.\d{1,2})?$/, 'decimal(10,2)');

module.exports.transaction = Joi.object({
    body: Joi.object({
        merchantId: merchantIdRule.required(),
        description: descriptionRule,
        paymentMethod: paymentMethodRule.required(),
        cardNumber: cardNumberRule.required(),
        cardHolder: cardHolderRule.required(),
        cardExpiration: cardExpirationRule.required(),
        cardCvv: cardCvvRule.required(),
        amount: amountRule.required()
    })
})