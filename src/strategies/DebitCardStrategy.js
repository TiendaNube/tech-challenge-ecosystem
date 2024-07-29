const PaymentStrategy = require('./PaymentStatregy');

class DebitCardStrategy extends PaymentStrategy {
    createPayable(transaction) {
        const amount = transaction.amount
        const fee = amount * 0.02
        return {
            transaction_id: transaction.id,
            amount: transaction.amount,
            amount: amount - fee,
            merchant_id: transaction.merchant_id,
            status: 'paid',
            fee,
            payment_date: transaction.created_at,
        };
    }
}

module.exports = DebitCardStrategy;