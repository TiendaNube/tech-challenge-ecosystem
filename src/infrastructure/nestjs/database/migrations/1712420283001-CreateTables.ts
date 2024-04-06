import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1712420283001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(
            `CREATE TYPE transaction_payment_method AS ENUM ('debit_card', 'credit_card')`,
        );
        await queryRunner.createTable(
            new Table({
                name: 'transactions',
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
                        name: 'description',
                        type: 'text',
                    },
                    {
                        name: 'paymentMethod',
                        type: 'enum',
                        enumName: 'transaction_payment_method',
                    },
                    {
                        name: 'cardHolder',
                        type: 'varchar',
                        length: '100',
                    },
                    {
                        name: 'cardNumber',
                        type: 'char',
                        length: '4',
                    },
                    {
                        name: 'cardExpirationDate',
                        type: 'date',
                    },
                    {
                        name: 'cardCvv',
                        type: 'char',
                        length: '3',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP(6)',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions', true);
        await queryRunner.query(`DROP TYPE transaction_payment_method`);
    }
}
