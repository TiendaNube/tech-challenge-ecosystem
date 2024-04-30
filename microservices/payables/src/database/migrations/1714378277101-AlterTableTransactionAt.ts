import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableTransactionAt1714378277101
  implements MigrationInterface
{
  name = 'AlterTableTransactionAt1714378277101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payables" ADD "transaction_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payables" DROP COLUMN "transaction_at"`,
    );
  }
}
