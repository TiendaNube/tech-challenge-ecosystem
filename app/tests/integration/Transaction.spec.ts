import request from 'supertest';
import { app } from '../../src/infra/http/server';
import prisma from '../setup';

describe('Transaction API', () => {
  let merchantId: number;

  beforeAll(async () => {
    const merchant = await prisma.merchant.create({
      data: {
        name: 'Test Merchant',
      },
    });
    merchantId = merchant.id;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.payable.deleteMany();
    await prisma.merchant.deleteMany();
  });

  it('should create a new transaction', async () => {
    const transactionData = {
      description: 'Test transaction',
      payment_method: 'credit_card',
      card_number: '1234567812345678',
      card_holder: 'John Doe',
      cvv: '123',
      expiration_date: '02/2024',
      merchant_id: merchantId,
      total: 100.0,
    };

    const res = await request(app).post('/transaction').send(transactionData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('merchant');
    expect(res.body.description).toBe(transactionData.description);
    expect(res.body.card_number).toBe(
      transactionData.card_number.substring(
        transactionData.card_number.length - 4,
      ),
    );
  });

  it('should create a new transaction', async () => {
    const transactionData = {
      description: 'Test transaction',
      payment_method: 'credit_card',
      card_number: '1234567812345678',
      card_holder: 'John Doe',
      cvv: '123',
      expiration_date: '02/2024',
      merchant_id: 2,
      total: 100.0,
    };

    const res = await request(app).post('/transaction').send(transactionData);

    expect(res.statusCode).toEqual(404);
  });
});
