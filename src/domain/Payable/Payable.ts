import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Payable extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn('uuid')
    uuid!: string
}
