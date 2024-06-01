import { Payable, PayableStatus } from '../../../../core/models/payable';

export class PayableFixture {
  public static default() {
    return new Payable(
      1,
      PayableStatus.PAID,
      new Date(),
      98,
      100,
      2,
      null,
      'id',
    );
  }
}
