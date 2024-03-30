import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRedundantColumn1711836778102 implements MigrationInterface {
    name = 'RemoveRedundantColumn1711836778102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" DROP COLUMN "merchant"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" ADD "merchant" character varying NOT NULL`);
    }

}
