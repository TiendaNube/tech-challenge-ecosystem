import { PayableFixture } from '../../models/test/fixtures/payable.fixture';
import { SummarizePayableBusiness } from '../payable/summarize.payables.business';
import { PayableStatus } from '../../models/payable';

describe('SummarizePayableBusiness', () => {
  const summarizePayableBusiness = new SummarizePayableBusiness();

  describe('SummarizePayableBusiness.summarize', () => {
    it('should create summary for only given statuses', () => {
      const payable = PayableFixture.default();
      payable.status = PayableStatus.PAID;

      const summarized = summarizePayableBusiness.summarize([payable]);

      expect(summarized[0].status).toBe(PayableStatus.PAID);
      expect(
        summarized.find(({ status }) => status === PayableStatus.WAITING_FUNDS),
      ).toBeUndefined();
    });

    it('should sum all amounts, discount and subtotal grouped by each status', () => {
      const payable1 = PayableFixture.default();
      payable1.status = PayableStatus.PAID;
      const payable2 = PayableFixture.default();
      payable2.status = PayableStatus.PAID;

      const payable3 = PayableFixture.default();
      payable3.status = PayableStatus.WAITING_FUNDS;
      const payable4 = PayableFixture.default();
      payable4.status = PayableStatus.WAITING_FUNDS;
      const payable5 = PayableFixture.default();
      payable5.status = PayableStatus.WAITING_FUNDS;

      const summarized = summarizePayableBusiness.summarize([
        payable1,
        payable2,
        payable3,
        payable4,
        payable5,
      ]);

      const summarizedPaid = summarized.find(
        ({ status }) => status === PayableStatus.PAID,
      );
      const summarizedWaiting = summarized.find(
        ({ status }) => status === PayableStatus.WAITING_FUNDS,
      );

      expect(summarizedPaid).not.toBeUndefined();
      expect(summarizedPaid.amount).toBe(payable1.amount + payable2.amount);
      expect(summarizedPaid.discount).toBe(
        payable1.discount + payable2.discount,
      );
      expect(summarizedPaid.subtotal).toBe(
        payable1.subtotal + payable2.subtotal,
      );

      expect(summarizedWaiting).not.toBeUndefined();
      expect(summarizedWaiting.amount).toBe(
        payable3.amount + payable4.amount + payable5.amount,
      );
      expect(summarizedWaiting.discount).toBe(
        payable3.discount + payable4.discount + payable5.discount,
      );
      expect(summarizedWaiting.subtotal).toBe(
        payable3.subtotal + payable4.subtotal + payable5.subtotal,
      );
    });
  });
});
