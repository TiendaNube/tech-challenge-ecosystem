
\c transactions;

-- Transactions

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(1, 1, 'T-Shirt Black/M', 'debit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(2, 1, 'T-Shirt Black/G', 'debit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(3, 1, 'T-Shirt White/G', 'credit_card', '2202', 'Jefferson de Souza', '02/2025', '123');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(4, 2, 'Athletic Leggings', 'debit_card', '1805', 'João da Silva', '05/2027', '321');

INSERT INTO public.transactions
(id, merchant_id, description, payment_method, card_number, card_holder, card_expiration_date, card_cvv)
VALUES(5, 2, 'Formal Blazer', 'credit_card', '1805', 'João da Silva', '05/2027', '321');

-- Payables

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(1, 1, 1, 'paid', 50, 1, 49, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(2, 2, 1, 'paid', 60, 1.2, 58.8, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(3, 3, 1, 'waiting_funds', 80, 3.2, 76.8, current_date+30);

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(4, 4, 2, 'paid', 100, 2, 98, now());

INSERT INTO public.payables
(id, transaction_id, merchant_id, status, subtotal, discount, total, create_date)
VALUES(5, 5, 2, 'waiting_funds', 200, 8, 192, current_date+30);
