import { PayableStatus } from '@domain/entities/payable.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payables' })
export class PayableEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    id: string;

    @Expose()
    @Column()
    merchantId: string;

    @Expose()
    @Column({ type: 'enum', enum: PayableStatus })
    status: PayableStatus;

    @Expose()
    @Column()
    total: number;

    @Expose()
    @Column()
    subTotal: number;

    @Expose()
    @Column()
    discount: number;

    @Expose()
    @Column()
    createdDate: Date;
}
