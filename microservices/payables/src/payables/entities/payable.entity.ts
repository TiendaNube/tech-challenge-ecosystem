import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PayableStatusEnum {
  PAID = 'PAID',
  WAITING_FUNDS = 'WAITING_FUNDS',
  DECLINED = 'DECLINED',
}

export enum PaymentMethodEnum {
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}

@Entity('payables')
export class Payable {
  @ApiProperty({ example: 'e09b86e3-fbe1-43a7-9f60-992b7b8bf01c' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  merchantId: string;

  @Column({
    type: String,
    nullable: false,
  })
  transactionId: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({
    type: 'enum',
    enum: PayableStatusEnum,
  })
  status: PayableStatusEnum;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
