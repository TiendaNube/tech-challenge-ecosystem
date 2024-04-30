import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayables1714374928621 implements MigrationInterface {
  name = 'CreateTablePayables1714374928621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payables_payment_method_enum" AS ENUM('DEBIT_CARD', 'CREDIT_CARD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payables_status_enum" AS ENUM('PAID', 'WAITING_FUNDS', 'DECLINED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "merchant_id" character varying NOT NULL, "transaction_id" character varying NOT NULL, "payment_method" "public"."payables_payment_method_enum" NOT NULL, "status" "public"."payables_status_enum" NOT NULL, "subtotal" numeric(10,2) NOT NULL, "discount" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33adb2ad800095b1f556f01b2c3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payables"`);
    await queryRunner.query(`DROP TYPE "public"."payables_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."payables_payment_method_enum"`,
    );
  }
}
