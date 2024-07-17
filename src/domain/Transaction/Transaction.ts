import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn('uuid')
    uuid!: string
}
