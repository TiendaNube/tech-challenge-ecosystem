import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransactions1714374746599
  implements MigrationInterface
{
  name = 'CreateTableTransactions1714374746599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_payment_method_enum" AS ENUM('DEBIT_CARD', 'CREDIT_CARD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "merchant_id" character varying NOT NULL, "description" character varying, "payment_method" "public"."transactions_payment_method_enum" NOT NULL, "card_last_four_digits" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `DROP TYPE "public"."transactions_payment_method_enum"`,
    );
  }
}
