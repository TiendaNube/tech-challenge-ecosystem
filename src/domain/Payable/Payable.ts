import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

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
  payableStatus!: PayableStatus

  @Column({
    type: 'int',
    nullable: false,
  })
  merchantId!: number

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
