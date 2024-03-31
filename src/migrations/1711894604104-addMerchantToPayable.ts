import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMerchantToPayable1711894604104 implements MigrationInterface {
    name = 'AddMerchantToPayable1711894604104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" ADD "merchantId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" DROP COLUMN "merchantId"`);
    }

}
