const {
    applySpec,
    prop,
} = require('ramda')

module.exports = applySpec({
    id: prop('id'),
    merchant_id: prop('merchantId'),
    description: prop('description'),
    payment_method: prop('paymentMethod'),
    card_number: prop('cardNumber'),
    card_holder: prop('cardHolder'),
    card_expiration: prop('cardExpiration'),
    card_cvv: prop('cardCvv'),
    amount: prop('amount')
})