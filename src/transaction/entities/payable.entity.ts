import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Payable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: ['paid', 'waiting_funds'] })
  status: 'paid' | 'waiting_funds';

  @ApiProperty()
  @Column({ type: 'date' })
  createDate: Date;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty()
  @Column()
  merchantId: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.payables)
  transaction: Transaction;
}
