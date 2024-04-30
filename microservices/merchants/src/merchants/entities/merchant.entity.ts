import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('merchants')
export class Merchant {
  @ApiProperty({ example: 'e09b86e3-fbe1-43a7-9f60-992b7b8bf01c' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  name: string;

  @Column({
    type: String,
    nullable: false,
  })
  documentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
