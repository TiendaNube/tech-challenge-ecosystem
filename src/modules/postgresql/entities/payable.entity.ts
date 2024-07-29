import { Column, Entity } from 'typeorm';
import { BasePostgreSqlEntity } from './base/base.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'payables' })
export class PayablesEntity extends BasePostgreSqlEntity<PayablesEntity> {
    /**
     * O ID do comerciante.
     * Deve ser um número inteiro e não nulo.
     */
    @AutoMap()
    @Column({ name: 'merchant_id', type: 'int', nullable: false })
    merchantId: number;

    /**
     * O status do recebível.
     * Deve ser uma string e não nula.
     */
    @AutoMap()
    @Column({ type: 'varchar', nullable: false })
    status: string;

    /**
     * A data de criação do recebível.
     * Deve ser uma data e hora válida e não nula.
     */
    @AutoMap()
    @Column({ name: 'create_date', type: 'timestamp', nullable: false })
    createDate: Date;

    /**
     * O valor subtotal do recebível.
     * Deve ser um número positivo e não nulo.
     */
    @AutoMap()
    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    subtotal: number;

    /**
     * O valor do desconto aplicado ao recebível.
     * Deve ser um número positivo e não nulo.
     */
    @AutoMap()
    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    discount: number;

    /**
     * O valor total do recebível após o desconto.
     * Deve ser um número positivo e não nulo.
     */
    @AutoMap()
    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    total: number;
}
