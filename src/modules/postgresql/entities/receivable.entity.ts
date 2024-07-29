import { Column, Entity } from 'typeorm';
import { BasePostgreSqlEntity } from './base/base.entity';

@Entity({ name: 'receivable' })
export class ReceivableEntity extends BasePostgreSqlEntity<ReceivableEntity> {
    @Column({ type: 'int', nullable: false })
    merchant_id: number;

    @Column({ type: 'varchar', nullable: false })
    status: string;

    @Column({ type: 'timestamp', nullable: false })
    create_date: Date;

    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    subtotal: number;

    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    discount: number;

    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    total: number;
}
