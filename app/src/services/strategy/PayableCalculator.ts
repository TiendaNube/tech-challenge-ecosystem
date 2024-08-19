import { injectable } from 'tsyringe';
import { GroupedPayable } from '@domain/Payable';
import { PayableStatus } from '../factories/PayableFactory';

@injectable()
export class PayableCalculator {
  calculateTotalByStatus(
    payables: GroupedPayable[],
    status: PayableStatus,
  ): number {
    const payablesWithStatus = payables.filter(item => item.status === status);
    return payablesWithStatus.length > 0
      ? Number(payablesWithStatus[0].total.toFixed(2))
      : 0;
  }

  calculatePaidTotals(payables: GroupedPayable[]): {
    totalPaid: number;
    totalPaidDiscounted: number;
  } {
    const paidPayables = payables.filter(
      item => item.status === PayableStatus.PAID,
    );

    if (paidPayables.length > 0) {
      const totalPaid = Number(paidPayables[0].total.toFixed(2));
      const totalPaidDiscounted = Number(
        paidPayables[0].total_discount.toFixed(2),
      );
      return { totalPaid, totalPaidDiscounted };
    }

    return { totalPaid: 0, totalPaidDiscounted: 0 };
  }
}
