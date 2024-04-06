import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePayableTable1712434314903 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE payable_status AS ENUM ('paid', 'waiting_funds')`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'payables',
                columns: [
                    {
                        name: 'id',
                        type: 'UUID',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'merchantId',
                        type: 'varchar',
                        length: '200',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enumName: 'payable_status',
                    },
                    {
                        name: 'subTotal',
                        type: 'decimal',
                    },
                    {
                        name: 'discount',
                        type: 'decimal',
                    },
                    {
                        name: 'total',
                        type: 'decimal',
                    },
                    {
                        name: 'createdDate',
                        type: 'timestamp',
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('payables', true);
        await queryRunner.query(`DROP TYPE payable_status`);
    }
}
