import { BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn } from 'typeorm'
import { Transaction } from '../Transaction/transaction'

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
}
