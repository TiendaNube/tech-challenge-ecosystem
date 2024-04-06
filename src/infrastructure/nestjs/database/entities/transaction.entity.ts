import { TransactionPaymentMethod } from '@domain/entities/transaction.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    merchantId: string;

    @Column('text')
    description: string;

    @Column({ type: 'enum', enum: TransactionPaymentMethod })
    paymentMethod: TransactionPaymentMethod;

    @Column()
    cardHolder: string;

    @Column({ length: 4 })
    cardNumber: string;

    @Column({ type: Date })
    cardExpirationDate: Date;

    @Column({ length: 3 })
    cardCvv: string;
}
