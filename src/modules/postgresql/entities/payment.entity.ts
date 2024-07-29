import { Column, Entity } from 'typeorm';
import { BasePostgreSqlEntity } from './base/base.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'payment' })
export class PaymentEntity extends BasePostgreSqlEntity<PaymentEntity> {
    /**
     * O valor total do pagamento.
     * Deve ser um número positivo e não nulo.
     */
    @AutoMap()
    @Column('numeric', {
        transformer: { to: (value: number) => value, from: (value: string) => parseFloat(value) },
        nullable: false,
    })
    total: number;

    /**
     * O ID do comerciante.
     * Deve ser um número inteiro e não nulo.
     */
    @AutoMap()
    @Column({ name: 'merchant_id', type: 'int', nullable: false })
    merchantId: number;

    /**
     * A descrição da transação.
     * Deve ser uma string e não nula.
     */
    @AutoMap()
    @Column({ type: 'varchar', nullable: false })
    description: string;

    /**
     * O método de pagamento utilizado.
     * Deve ser uma string e não nula.
     */
    @AutoMap()
    @Column({ name: 'payment_method', type: 'varchar', nullable: false })
    paymentMethod: string;

    /**
     * Os últimos 4 dígitos do número do cartão de crédito.
     * Deve ser uma string de exatamente 4 caracteres e não nula.
     */
    @AutoMap()
    @Column({ name: 'card_number', type: 'varchar', length: 4, nullable: false })
    cardNumber: string;

    /**
     * O nome do titular do cartão de crédito.
     * Deve ser uma string e não nula.
     */
    @AutoMap()
    @Column({ name: 'card_holder', type: 'varchar', nullable: false })
    cardHolder: string;

    /**
     * A data de expiração do cartão de crédito no formato MM/AAAA.
     * Deve ser uma string de exatamente 7 caracteres e não nula.
     */
    @AutoMap()
    @Column({ name: 'card_expiration_date', type: 'varchar', length: 7, nullable: false })
    cardExpirationDate: string;

    /**
     * O código CVV do cartão de crédito.
     * Deve ser uma string de exatamente 3 caracteres e não nula.
     */
    @AutoMap()
    @Column({ name: 'card_cvv', type: 'varchar', length: 3, nullable: false })
    cardCVV: string;
}
