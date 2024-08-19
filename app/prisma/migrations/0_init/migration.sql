-- CreateTable
CREATE TABLE "merchant" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payable" (
    "id" SERIAL NOT NULL,
    "merchant_id" INTEGER NOT NULL,
    "status" VARCHAR NOT NULL,
    "create_date" DATE NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "merchant_id" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "payment_method" VARCHAR NOT NULL,
    "card_number" VARCHAR(4) NOT NULL,
    "card_holder" VARCHAR NOT NULL,
    "expiration_date" DATE NOT NULL,
    "cvv" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_payable_date" ON "payable"("merchant_id", "create_date");

-- AddForeignKey
ALTER TABLE "payable" ADD CONSTRAINT "fk_merchant_id_transaction" FOREIGN KEY ("merchant_id") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "fk_merchant_id_transaction" FOREIGN KEY ("merchant_id") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

