import 'reflect-metadata';
import { PayableCalculator } from '../../src/services/strategy/PayableCalculator';
import { GroupedPayable } from '@domain/Payable';
import { PayableStatus } from '../../src/services/factories/PayableFactory';

describe('PayableCalculator', () => {
  let payableCalculator: PayableCalculator;

  beforeEach(() => {
    payableCalculator = new PayableCalculator();
  });

  describe('calculateTotalByStatus', () => {
    it('should return the total for the specified status', () => {
      const payables: GroupedPayable[] = [
        { status: PayableStatus.PAID, total: 150.75, total_discount: 10 },
        {
          status: PayableStatus.WAITING_FUNDS,
          total: 100.25,
          total_discount: 5,
        },
      ];

      const result = payableCalculator.calculateTotalByStatus(
        payables,
        PayableStatus.PAID,
      );

      expect(result).toBe(150.75);
    });

    it('should return 0 if no payables match the specified status', () => {
      const payables: GroupedPayable[] = [
        {
          status: PayableStatus.WAITING_FUNDS,
          total: 100.25,
          total_discount: 5,
        },
      ];

      const result = payableCalculator.calculateTotalByStatus(
        payables,
        PayableStatus.PAID,
      );

      expect(result).toBe(0);
    });
  });

  describe('calculatePaidTotals', () => {
    it('should return the totalPaid and totalPaidDiscounted when there are paid payables', () => {
      const payables: GroupedPayable[] = [
        { status: PayableStatus.PAID, total: 200.5, total_discount: 15.5 },
      ];

      const result = payableCalculator.calculatePaidTotals(payables);

      expect(result.totalPaid).toBe(200.5);
      expect(result.totalPaidDiscounted).toBe(15.5);
    });

    it('should return 0 for totalPaid and totalPaidDiscounted if there are no paid payables', () => {
      const payables: GroupedPayable[] = [
        {
          status: PayableStatus.WAITING_FUNDS,
          total: 100.25,
          total_discount: 5,
        },
      ];

      const result = payableCalculator.calculatePaidTotals(payables);

      expect(result.totalPaid).toBe(0);
      expect(result.totalPaidDiscounted).toBe(0);
    });
  });
});
