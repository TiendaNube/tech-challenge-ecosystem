class PaymentStrategy {
    createPayable(transaction) {
        throw new Error('Method createPayable() must be implemented');
    }
}
module.exports = PaymentStrategy;