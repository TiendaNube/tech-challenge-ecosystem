#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE payment (
        id SERIAL PRIMARY KEY,
        total NUMERIC CHECK (total > 0),
        merchant_id INTEGER NOT NULL,
        description VARCHAR NOT NULL,
        payment_method VARCHAR NOT NULL,
        card_number VARCHAR(4) NOT NULL,
        card_holder VARCHAR NOT NULL,
        card_expiration_date VARCHAR(7) NOT NULL,
        card_cvv VARCHAR(3) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE receivable (
        id SERIAL PRIMARY KEY,
        merchant_id INTEGER NOT NULL,
        status VARCHAR NOT NULL,
        create_date TIMESTAMP NOT NULL,
        subtotal NUMERIC CHECK (subtotal > 0),
        discount NUMERIC CHECK (discount > 0),
        total NUMERIC CHECK (total > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
EOSQL
