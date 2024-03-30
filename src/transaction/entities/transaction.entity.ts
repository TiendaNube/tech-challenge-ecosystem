import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalValue: number;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: ['debit_card', 'credit_card'] })
  paymentMethod: string;

  @ApiProperty()
  @Column({ length: 4 })
  cardLastDigits: string;

  @ApiProperty()
  @Column()
  cardHolderName: string;

  @ApiProperty({ type: Date })
  @Column({ type: 'date' })
  expirationDate: Date;

  @ApiProperty()
  @Column({ length: 3 })
  cvv: string;

  @ApiProperty()
  @Column()
  merchantId: string;
}
