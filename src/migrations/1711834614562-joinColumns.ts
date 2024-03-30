import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinColumns1711834614562 implements MigrationInterface {
    name = 'JoinColumns1711834614562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "payableId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "UQ_eefb0a4419b4c213e27323bb9b7" UNIQUE ("payableId")`);
        await queryRunner.query(`ALTER TABLE "payable" ADD "transactionId" uuid`);
        await queryRunner.query(`ALTER TABLE "payable" ADD CONSTRAINT "UQ_23f2871fd3bc103c0dbc5bb921c" UNIQUE ("transactionId")`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_eefb0a4419b4c213e27323bb9b7" FOREIGN KEY ("payableId") REFERENCES "payable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payable" ADD CONSTRAINT "FK_23f2871fd3bc103c0dbc5bb921c" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" DROP CONSTRAINT "FK_23f2871fd3bc103c0dbc5bb921c"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_eefb0a4419b4c213e27323bb9b7"`);
        await queryRunner.query(`ALTER TABLE "payable" DROP CONSTRAINT "UQ_23f2871fd3bc103c0dbc5bb921c"`);
        await queryRunner.query(`ALTER TABLE "payable" DROP COLUMN "transactionId"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_eefb0a4419b4c213e27323bb9b7"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "payableId"`);
    }

}
