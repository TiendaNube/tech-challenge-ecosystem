import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'enum', enum: ['paid', 'waiting_funds'] })
  status: 'paid' | 'waiting_funds';

  @Column({ type: 'date' })
  createDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.payables)
  transaction: Transaction;
}
