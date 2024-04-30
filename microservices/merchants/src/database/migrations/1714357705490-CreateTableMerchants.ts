import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMerchants1714357705490 implements MigrationInterface {
  name = 'CreateTableMerchants1714357705490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "document_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_4fd312ef25f8e05ad47bfe7ed25" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "merchants"`);
  }
}
