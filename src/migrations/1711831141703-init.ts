import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1711831141703 implements MigrationInterface {
    name = 'Init1711831141703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payable_status_enum" AS ENUM('paid', 'waiting_funds')`);
        await queryRunner.query(`CREATE TABLE "payable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "merchant" character varying NOT NULL, "status" "public"."payable_status_enum" NOT NULL, "createDate" date NOT NULL, "subtotal" numeric(10,2) NOT NULL, "discount" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, CONSTRAINT "PK_9c451177bd6644fd97344ea3761" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_paymentmethod_enum" AS ENUM('debit_card', 'credit_card')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalValue" numeric(10,2) NOT NULL, "description" character varying NOT NULL, "paymentMethod" "public"."transaction_paymentmethod_enum" NOT NULL, "cardLastDigits" character varying(4) NOT NULL, "cardHolderName" character varying NOT NULL, "expirationDate" date NOT NULL, "cvv" character varying(3) NOT NULL, "merchantId" character varying NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_paymentmethod_enum"`);
        await queryRunner.query(`DROP TABLE "payable"`);
        await queryRunner.query(`DROP TYPE "public"."payable_status_enum"`);
    }

}
