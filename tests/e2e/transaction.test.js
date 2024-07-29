const request = require('supertest')
const app = require('../../src/app')

//before run this test, it's probaly necessary run npm run seed and get merchantId
describe(`POST /transaction`, () => {
    it('should create a transaction and return the transaction object', async () => {
        const requestBody = {
            merchantId: "896152d1-577e-401b-9d53-15e8ed968ec3",
            description: "T-Shirt Black/M",
            paymentMethod: "Debit_Card",
            cardNumber: "0000000000004338",
            cardHolder: "John Smith",
            cardExpiration: "12/2028",
            cardCvv: "123",
            amount: "1000.50"
        };
        const response = await request(app)
            .post('/transaction')
            .send(requestBody)
            .expect(201)
        const { transaction } = response.body;

        expect(transaction).toHaveProperty('id');
        expect(transaction.merchant_id).toBe(requestBody.merchantId);
        expect(transaction.description).toBe(requestBody.description);
        expect(transaction.payment_method).toBe(requestBody.paymentMethod);
        expect(transaction.card_number).toBe(requestBody.cardNumber);
        expect(transaction.card_holder).toBe(requestBody.cardHolder);
        expect(transaction.card_expiration).toBe(requestBody.cardExpiration);
        expect(transaction.card_cvv).toBe(requestBody.cardCvv);
        expect(transaction.amount).toBe(requestBody.amount);
        expect(transaction).toHaveProperty('created_at');
    });

    it('should return 400 for an invalid payment method', async () => {
        const requestBody = {
            merchantId: "896152d1-577e-401b-9d53-15e8ed968ec3",
            description: "T-Shirt Black/M",
            paymentMethod: "Invalid_Method",
            cardNumber: "0000000000004338",
            cardHolder: "John Smith",
            cardExpiration: "12/2028",
            cardCvv: "123",
            amount: "1000.50"
        };

        const response = await request(app)
            .post('/transaction')
            .send(requestBody)
            .expect(400);

        expect(response.body).toEqual({ message: "invalid.payment method not supported" })
    });

    it('should return 400 for an invalid merchant ID', async () => {
        const requestBody = {
            merchantId: "invalid-merchant-id",
            description: "T-Shirt Black/M",
            paymentMethod: "Debit_Card",
            cardNumber: "0000000000004338",
            cardHolder: "John Smith",
            cardExpiration: "12/2028",
            cardCvv: "123",
            amount: "1000.50"
        };

        const response = await request(app)
            .post('/transaction')
            .send(requestBody)
            .expect(400);

        expect(response.body).toEqual({ message: 'invalid.MerchantId' });
    });
})