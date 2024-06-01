import { PayableStatus } from '../../../core/models/payable';
import { PayableEntity } from '../payable.entity';
import { TransactionEntity } from '../transaction.entity';

export class PayableEntityFixture {
  public static default(transaction?: TransactionEntity) {
    const entity = new PayableEntity();

    entity.id = 'id';
    entity.merchantId = 1;
    entity.status = PayableStatus.PAID;
    entity.discount = 98;
    entity.amount = 100;
    entity.subtotal = 2;
    entity.date = new Date();

    if (transaction) {
      entity.transaction = transaction;
    }

    return entity;
  }
}
