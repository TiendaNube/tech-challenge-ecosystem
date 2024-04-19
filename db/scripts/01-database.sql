
CREATE DATABASE transactions;

\c transactions;

CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "payment_method" VARCHAR(255) NOT NULL CHECK (payment_method IN ('debit_card', 'credit_card')),
    "card_number" VARCHAR(4) NOT NULL,
    "card_holder" VARCHAR(255) NOT NULL,
    "card_expiration_date" VARCHAR(7) NOT NULL,
    "card_cvv" VARCHAR(3) NOT NULL,
    CONSTRAINT "pk_transactions" PRIMARY KEY ("id")
);

CREATE TABLE "payables" (
    "id" SERIAL NOT NULL,
    "merchant_id" BIGINT,
    "status" VARCHAR(100) NOT NULL CHECK (status IN ('paid', 'waiting_funds')),
    "subtotal" FLOAT NOT NULL,
    "discount" FLOAT NOT NULL,
    "total" FLOAT NOT NULL,
    "create_date" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "pk_payables" PRIMARY KEY ("id"),
    CONSTRAINT "fk_merchant_id" FOREIGN KEY("merchant_id") REFERENCES transactions("id") ON DELETE SET NULL
);


CREATE INDEX ON payables ("create_date");