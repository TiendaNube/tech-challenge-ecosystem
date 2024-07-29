const InvalidError = require("../Errors/Invalid");
const CreditCardStrategy = require("../strategies/CreditCardStrategy")
const DebitCardStrategy = require("../strategies/DebitCardStrategy")
const { models } = require('../database')

module.exports.createPayable = async(transaction) =>{
    const strategies = {
        Credit_Card: new CreditCardStrategy(),
        Debit_Card: new DebitCardStrategy()
    }

    const strategy = strategies[transaction.payment_method];

    if(!strategy) {
        throw new InvalidError("payment method not supported");
    }

    const payableData = strategy.createPayable(transaction)

    const payable = await models.payables.create(payableData)

    return payable
}