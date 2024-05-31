import { Card } from '../../core/models/card';
import { PaymentMethod, Transaction } from '../../core/models/transaction';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Payable } from 'src/core/models/payable';
import { PayableEntity } from './payable.entity';

export const TRANSACTION_TYPEORM_REPOSITORY = 'TRANSACTION_TYPEORM_REPOSITORY';

@Entity()
export class TransactionEntity extends BaseEntity {
  @Column({ name: 'merchant_id' })
  public merchantId: number;

  @Column()
  public description: string;

  @Column({ name: 'paymnet_method' })
  public paymentMethod: string;

  @Column({ type: 'decimal', precision: 13, scale: 2, default: 0 })
  public amount: number;

  @Column({ name: 'card_number' })
  public cardNumber: string;

  @Column({ name: 'card_holder' })
  public cardHolder: string;

  @Column({ name: 'card_expiration_date' })
  public cardExpirationDate: string;

  @Column({ name: 'card_cvv' })
  public cardCvv: string;

  @OneToMany(() => PayableEntity, (payable) => payable.transaction, {
    eager: false,
  })
  public payables: Payable[];

  public static fromTransaction(transaction: Transaction): TransactionEntity {
    const entity = new TransactionEntity();

    entity.merchantId = transaction.merchantId;
    entity.amount = transaction.amount;
    entity.description = transaction.description;
    entity.paymentMethod = transaction.paymentMethod;
    entity.cardNumber = transaction.card.number;
    entity.cardHolder = transaction.card.holder;
    entity.cardExpirationDate = transaction.card.expirationDate;
    entity.cardCvv = transaction.card.cvv;

    return entity;
  }

  public toTransaction(): Transaction {
    return new Transaction(
      this.merchantId,
      this.description,
      PaymentMethod[this.paymentMethod],
      Number(this.amount),
      new Card(
        this.cardNumber,
        this.cardHolder,
        this.cardExpirationDate,
        this.cardCvv,
      ),
      this.id,
      this.createdAt,
    );
  }
}
