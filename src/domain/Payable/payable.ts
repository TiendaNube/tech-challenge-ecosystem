import { BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn } from 'typeorm'
import { addDays } from 'date-fns'
import { PaymentMethod, Transaction } from '../Transaction/transaction'
import { toCurrency } from '../../commons/utils'
import { CREDIT_CARD_FEE, DEBIT_CARD_FEE } from './fee.constants'

export enum PayableStatus {
  PAID = 'paid',
  WAITING_FUNDS = 'waiting_funds',
}

@Entity()
export class Payable extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
    uuid!: string

  @Column({
    type: 'real',
    nullable: false,
  })
    subtotal!: number

  @Column({
    type: 'real',
    nullable: false,
  })
    total!: number

  @Column({
    type: 'real',
    nullable: false,
  })
    discount!: number

  @Column({
    type: 'enum',
    enum: PayableStatus,
    nullable: false,
  })
    status!: PayableStatus

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
    date!: Date

  @Column({
    type: 'int',
    nullable: false,
  })
    merchantId!: number

  @ManyToOne(() => Transaction, {
    nullable: false,
  })
    originatingTransaction!: Transaction

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
    createdAt!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
    updatedAt!: Date

  public static createPayableFromTransaction(transaction: Transaction) : Payable {
    const payableSetupsByPaymentMethod = {
      [PaymentMethod.DEBIT_CARD]: this.setupPayableFromDebitTransaction(transaction),
      [PaymentMethod.CREDIT_CARD]: this.setupPayableFromCreditTransaction(transaction),
    }

    const newPayable = payableSetupsByPaymentMethod[transaction.paymentMethod]
    newPayable.merchantId = transaction.merchantId
    newPayable.subtotal = toCurrency(transaction.value)
    newPayable.total = toCurrency(newPayable.subtotal - newPayable.discount)
    return newPayable
  }

  private static setupPayableFromDebitTransaction(transaction: Transaction) : Payable {
    const newPayable = new Payable()
    newPayable.status = PayableStatus.PAID
    newPayable.date = new Date()
    newPayable.discount = toCurrency(transaction.value * DEBIT_CARD_FEE)
    return newPayable
  }

  private static setupPayableFromCreditTransaction(transaction: Transaction) : Payable {
    const newPayable = new Payable()
    newPayable.status = PayableStatus.WAITING_FUNDS
    newPayable.date = addDays(new Date(), 30)
    newPayable.discount = toCurrency(transaction.value * CREDIT_CARD_FEE)
    return newPayable
  }
}
