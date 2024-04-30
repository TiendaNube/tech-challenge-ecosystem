import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentMethodEnum {
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}

@Entity({ name: 'transactions' })
export class Transaction {
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
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({
    type: String,
    nullable: false,
  })
  cardLastFourDigits: string;

  @CreateDateColumn()
  createdAt: Date;
}
