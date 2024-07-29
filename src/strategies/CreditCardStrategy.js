const PaymentStrategy = require('./PaymentStatregy');
const moment = require('moment');

class CreditCardStrategy extends PaymentStrategy {
    createPayable(transaction) {
        const amount = transaction.amount
        console.log("🚀 ~ CreditCardStrategy ~ createPayable ~ amount:", amount)
        const fee = amount*0.04
        return {
            transaction_id: transaction.id,
            amount: amount - fee,
            merchant_id: transaction.merchant_id,
            status: 'waiting_funds',
            fee,
            payment_date: moment(transaction.created_at).add(30, 'days').toDate(),
        };
    }
}

module.exports = CreditCardStrategy;