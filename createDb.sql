CREATE DATABASE IF NOT EXISTS payment_processing;
USE payment_processing;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_method VARCHAR(20),
    card_number VARCHAR(30),
    card_holder_name VARCHAR(120),
    card_expiration_date VARCHAR(10),
    card_cvv VARCHAR(4),
    description VARCHAR(100),
    merchant_id INT,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2),
    payment_id VARCHAR(36) UNIQUE
);

CREATE TABLE IF NOT EXISTS payables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    merchant_id VARCHAR(36),
    status VARCHAR(30),
    create_date DATETIME,
    subtotal DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    total DECIMAL(10, 2)
);