import { TransactionPaymentMethod } from '@domain/entities/transaction.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    id: string;

    @Expose()
    @Column()
    merchantId: string;

    @Expose()
    @Column('text')
    description: string;

    @Expose()
    @Column({ type: 'enum', enum: TransactionPaymentMethod })
    paymentMethod: TransactionPaymentMethod;

    @Expose()
    @Column()
    cardHolder: string;

    @Expose()
    @Column({ length: 4 })
    cardNumber: string;

    @Expose()
    @Column({ type: Date })
    cardExpirationDate: Date;

    @Expose()
    @Column({ length: 3 })
    cardCvv: string;

    @Expose()
    @Column()
    totalValue: number;
}
