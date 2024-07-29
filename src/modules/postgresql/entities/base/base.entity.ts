import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BasePostgreSqlEntity<T> {
    constructor(values?: Partial<T>) {
        values && Object.assign(this, values);
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
