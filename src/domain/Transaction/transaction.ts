import { BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn } from 'typeorm'

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
}

@Entity()
export class Transaction extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
    uuid!: string

  @Column({
    type: 'int',
    nullable: false,
  })
    merchantId!: number

  @Column({
    type: 'varchar',
    nullable: false,
  })
    description!: string

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
  })
    paymentMethod!: PaymentMethod

  @Column({
    type: 'varchar',
    nullable: false,
  })
    cardNumber!: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
    cardHolder!: string

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
    cardExpirationDate!: Date

  @Column({
    type: 'int',
    nullable: false,
  })
    cardCVV!: number

  @Column({
    type: 'real',
    nullable: false,
  })
    value!: number

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
