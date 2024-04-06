import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTotalValueColumnToTransaction1712433140184
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'transactions',
            new TableColumn({
                name: 'totalValue',
                type: 'decimal',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('transactions', 'totalValue');
    }
}
