import { Card } from '../../core/models/card';
import { Transaction } from '../../core/models/transaction';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'merchant_id' })
  public merchantId: number;

  @Column()
  public description: string;

  @Column({ name: 'paymnet_method' })
  public paymentMethod: string;

  @Column({ name: 'card_number' })
  public cardNumber: string;

  @Column({ name: 'card_holder' })
  public cardHolder: string;

  @Column({ name: 'card_expiration_date' })
  public cardExpirationDate: string;

  @Column({ name: 'card_cvv' })
  public cardCvv: string;

  public static fromTransaction(transaction: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.merchantId = transaction.merchantId;
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
      this.paymentMethod,
      new Card(
        this.cardNumber,
        this.cardHolder,
        this.cardExpirationDate,
        this.cardCvv,
      ),
      this.id
    );
  }
}
