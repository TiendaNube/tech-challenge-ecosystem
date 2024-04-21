
\c transactions;

-- Transactions

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(10000, 1, 'T-Shirt Black/M', 'debit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(10001, 1, 'T-Shirt Black/G', 'debit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(10002, 1, 'T-Shirt White/G', 'credit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(10003, 2, 'Athletic Leggings', 'debit_card', '1805', 'João da Silva', '05/2027', '321');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(10004, 2, 'Formal Blazer', 'credit_card', '1805', 'João da Silva', '05/2027', '321');

-- Payables

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(10000, 10000, 1, 'paid', 50, 1, 49, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(10001, 10001, 1, 'paid', 60, 1.2, 58.8, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(10002, 10002, 1, 'waiting_funds', 80, 3.2, 76.8, current_date+30);

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(10003, 10003, 2, 'paid', 100, 2, 98, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(10004, 10004, 2, 'waiting_funds', 200, 8, 192, current_date+30);
