import request from 'supertest';
import { app } from '../../src/infra/http/server';
import prisma from '../setup';

beforeAll(async () => {
  await prisma.merchant.create({
    data: {
      id: 1,
      name: 'Test Merchant',
    },
  });

  await prisma.payable.createMany({
    data: [
      {
        id: 1,
        merchant_id: 1,
        status: 'paid',
        create_date: new Date('2024-01-15'),
        discount: 10,
        subtotal: 100,
        total: 90,
      },
      {
        id: 2,
        merchant_id: 1,
        status: 'waiting_funds',
        create_date: new Date('2024-06-20'),
        discount: 20,
        subtotal: 200,
        total: 180,
      },
      {
        id: 3,
        merchant_id: 1,
        status: 'paid',
        create_date: new Date('2024-12-10'),
        discount: 5,
        subtotal: 50,
        total: 45,
      },
    ],
  });
});

afterAll(async () => {
  await prisma.payable.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.$disconnect();
});

describe('GET /payable/total', () => {
  it('should return the total of payables grouped by status', async () => {
    const response = await request(app).get('/payable/total').query({
      merchant_id: '1',
      from_date: '2024-01-01',
      to_date: '2024-12-31',
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.totalPaid).toBe(135);
    expect(response.body.totalPaidDiscounted).toBe(15);
    expect(response.body.totalFuture).toBe(180);
  });

  it('should return 400 if missing query parameters', async () => {
    const response = await request(app).get('/payable/total').query({
      merchant_id: '1',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'to_date is a required field',
      status: 'error',
    });
  });

  it('should return 404 if merchant does not exists', async () => {
    const response = await request(app).get('/payable/total').query({
      merchant_id: 2,
      to_date: '2024-01-01',
      from_date: '2024-01-02',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Merchant not found',
      status: 'error',
    });
  });
});
