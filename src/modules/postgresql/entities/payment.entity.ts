import { Column, Entity } from 'typeorm';
import { BasePostgreSqlEntity } from './base/base.entity';

@Entity({ name: 'payment' })
export class PaymentEntity extends BasePostgreSqlEntity<PaymentEntity> {
    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    total: number;

    @Column({ type: 'int', nullable: false })
    merchant_id: number;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'varchar', nullable: false })
    payment_method: string;

    @Column({ type: 'varchar', length: 4, nullable: false })
    card_number: string;

    @Column({ type: 'varchar', nullable: false })
    card_holder: string;

    @Column({ type: 'varchar', length: 7, nullable: false })
    card_expiration_date: string;

    @Column({ type: 'varchar', length: 3, nullable: false })
    card_cvv: string;
}
