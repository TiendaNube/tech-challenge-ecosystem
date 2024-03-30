import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  merchant: string;

  @Column({ type: 'enum', enum: ['paid', 'waiting_funds'] })
  status: string;

  @Column({ type: 'date' })
  createDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
