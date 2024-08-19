import 'reflect-metadata';
import {
  PayableStatus,
  PayableFactory,
} from '../../src/services/factories/PayableFactory';
import { PaymentMethod } from '@domain/Transaction';
import { CreatePayableDTO } from '@services/IPayableService';

describe('PayableFactory', () => {
  let payableFactory: PayableFactory;

  beforeEach(() => {
    payableFactory = new PayableFactory();
  });

  describe('createPayableFromDTO', () => {
    it('should create a payable with status PAID and correct discount for DEBIT_CARD', () => {
      const createPayableDTO: CreatePayableDTO = {
        merchant_id: 1,
        total: 100,
        transaction_date: new Date(),
        payment_method: PaymentMethod.DEBIT_CARD,
      };

      const payable = payableFactory.createPayableFromDTO(createPayableDTO);

      expect(payable.merchant_id).toBe(createPayableDTO.merchant_id);
      expect(payable.status).toBe(PayableStatus.PAID);
      expect(payable.discount).toBe(2); // 2% of 100
      expect(payable.total).toBe(98); // 100 - 2
    });

    it('should create a payable with status WAITING_FUNDS and correct discount for CREDIT_CARD', () => {
      const transactionDate = new Date();
      const createPayableDTO: CreatePayableDTO = {
        merchant_id: 1,
        total: 200,
        transaction_date: transactionDate,
        payment_method: PaymentMethod.CREDIT_CARD,
      };

      const payable = payableFactory.createPayableFromDTO(createPayableDTO);

      expect(payable.merchant_id).toBe(createPayableDTO.merchant_id);
      expect(payable.status).toBe(PayableStatus.WAITING_FUNDS);
      expect(payable.discount).toBe(8); // 4% of 200
      expect(payable.total).toBe(192); // 200 - 8
      transactionDate.setDate(transactionDate.getDate() + 30);
      expect(payable.create_date.getDate()).toBe(transactionDate.getDate()); // 30 days added
    });

    it('should throw an error if the payment method is invalid', () => {
      const createPayableDTO: CreatePayableDTO = {
        merchant_id: 1,
        total: 100,
        transaction_date: new Date(),
        payment_method: 'INVALID_METHOD' as PaymentMethod,
      };

      expect(() =>
        payableFactory.createPayableFromDTO(createPayableDTO),
      ).toThrow();
    });
  });
});
