import { PayableStatus } from '../../models/payable';
import { PayableFromTransactionBusiness } from '../payable/payable.from.transaction.business';
import { PaymentMethod } from '../../models/transaction';
import { TransactionFixture } from '../../models/test/fixtures/transaction.fixture';
import * as dayjs from 'dayjs';

describe('PayableFromTransactionBusiness', () => {
  const payableFromTransactionBusiness = new PayableFromTransactionBusiness();

  describe('PayableFromTransactionBusiness.generatePayableProperties', () => {
    it('should generate for all payment methods', () => {
      const allMethods = Object.keys(PaymentMethod);

      const allProperties = allMethods
        .map((method) =>
          payableFromTransactionBusiness.generatePayableProperties(
            PaymentMethod[method],
          ),
        )
        .filter((property) => !!property);

      expect(allProperties.length).toBe(allMethods.length);
    });

    it('should generate for CREDIT_CARD', () => {
      const properties =
        payableFromTransactionBusiness.generatePayableProperties(
          PaymentMethod.CREDIT_CARD,
        );

      expect(properties).toBeDefined();
      expect(properties.payableStatus).toBe(PayableStatus.WAITING_FUNDS);
      expect(properties.fee).toBe(0.04);
      expect(properties.creationDateAddition).toBe(30);
    });

    it('should generate for DEBIT_CARD', () => {
      const properties =
        payableFromTransactionBusiness.generatePayableProperties(
          PaymentMethod.DEBIT_CARD,
        );

      expect(properties).toBeDefined();
      expect(properties.payableStatus).toBe(PayableStatus.PAID);
      expect(properties.fee).toBe(0.02);
      expect(properties.creationDateAddition).toBe(0);
    });
  });

  describe('PayableFromTransactionBusiness.createPayable', () => {
    it('should create a payable from a transaction of CREDIT_CARD', () => {
      const transaction = TransactionFixture.default();
      const payable = payableFromTransactionBusiness.createPayable(transaction);

      expect(payable.merchantId).toBe(transaction.merchantId);
      expect(payable.status).toBe(PayableStatus.WAITING_FUNDS);
      expect(payable.date.toDateString()).toBe(
        dayjs(transaction.createdAt).add(30, 'days').toDate().toDateString(),
      );
      expect(payable.discount).toBe(transaction.amount * 0.04);
      expect(payable.amount).toBe(
        transaction.amount - transaction.amount * 0.04,
      );
      expect(payable.subtotal).toBe(transaction.amount);
      expect(payable.transaction).toBe(transaction);
    });

    it('should create a payable from a transaction of DEBIT_CARD', () => {
      const transaction = TransactionFixture.default();
      transaction.paymentMethod = PaymentMethod.DEBIT_CARD;

      const payable = payableFromTransactionBusiness.createPayable(transaction);

      expect(payable.merchantId).toBe(transaction.merchantId);
      expect(payable.status).toBe(PayableStatus.PAID);
      expect(payable.date.toDateString()).toBe(
        dayjs(transaction.createdAt).add(0, 'days').toDate().toDateString(),
      );
      expect(payable.discount).toBe(transaction.amount * 0.02);
      expect(payable.amount).toBe(
        transaction.amount - transaction.amount * 0.02,
      );
      expect(payable.subtotal).toBe(transaction.amount);
      expect(payable.transaction).toBe(transaction);
    });
  });
});
