import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BasePostgreSqlEntity<T> {
    /**
     * Construtor da classe BasePostgreSqlEntity.
     * Permite a inicialização de propriedades com um objeto parcial do tipo T.
     *
     * @param values - Um objeto opcional contendo valores para inicializar a entidade.
     */
    constructor(values?: Partial<T>) {
        values && Object.assign(this, values);
    }

    /**
     * O identificador único da entidade.
     * Este campo é gerado automaticamente.
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * A data de criação da entidade.
     * Este campo é preenchido automaticamente com o timestamp atual no momento da criação.
     */
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
