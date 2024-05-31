import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Payable, PayableStatus } from '../../core/models/payable';
import { TransactionEntity } from './transaction.entity';

export const PAYABLE_TYPEORM_REPOSITORY = 'PAYABLE_TYPEORM_REPOSITORY';

@Entity()
export class PayableEntity extends BaseEntity {
  @Column()
  public merchantId: number;

  @Column()
  public status: string;

  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  public discount: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  public amount: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  public subtotal: number;

  @Column({ type: 'timestamp' })
  public date: Date;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.payables)
  transaction: TransactionEntity;

  public toPayable(): Payable {
    return new Payable(
      this.merchantId,
      PayableStatus[this.status],
      this.date,
      Number(this.discount),
      Number(this.amount),
      Number(this.subtotal),
      this.transaction && this.transaction.toTransaction(),
      this.id,
    );
  }

  public static fromPayable(
    payable: Payable,
    transaction?: TransactionEntity,
  ): PayableEntity {
    const entity = new PayableEntity();

    entity.id = payable.id;
    entity.merchantId = payable.merchantId;
    entity.status = payable.status;
    entity.discount = payable.discount;
    entity.amount = payable.amount;
    entity.subtotal = payable.subtotal;
    entity.date = payable.date;

    if (transaction) {
      entity.transaction = transaction;
    }

    return entity;
  }
}
