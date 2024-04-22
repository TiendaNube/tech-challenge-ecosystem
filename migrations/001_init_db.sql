--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: merchants; Type: TABLE; Schema: public; Owner: dbuser
--

CREATE TABLE public.merchants (
    id bigint NOT NULL,
    name character varying(256),
    created_at timestamp without time zone DEFAULT now(),
    document character varying(18)
);


ALTER TABLE public.merchants OWNER TO dbuser;

--
-- Name: merchants_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE public.merchants_id_seq
    START WITH 3000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.merchants_id_seq OWNER TO dbuser;

--
-- Name: merchants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE public.merchants_id_seq OWNED BY public.merchants.id;


--
-- Name: payables; Type: TABLE; Schema: public; Owner: dbuser
--

CREATE TABLE public.payables (
    id bigint NOT NULL,
    transaction_id bigint NOT NULL,
    merchant_id bigint NOT NULL,
    status character varying(25),
    create_date timestamp without time zone,
    subtotal real,
    discount_fee real,
    total real,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payables OWNER TO dbuser;

--
-- Name: payables_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE public.payables_id_seq
    START WITH 1500
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payables_id_seq OWNER TO dbuser;

--
-- Name: payables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE public.payables_id_seq OWNED BY public.payables.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: dbuser
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    merchant_id bigint NOT NULL,
    description character varying(256),
    payment_method character varying(11),
    card_number character varying(4),
    card_owner character varying(100),
    card_expiration_date date,
    card_cvv character varying(3),
    created_at timestamp without time zone DEFAULT now(),
    amount real
);


ALTER TABLE public.transactions OWNER TO dbuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: dbuser
--

CREATE SEQUENCE public.transactions_id_seq
    START WITH 1500
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO dbuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dbuser
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: merchants id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.merchants ALTER COLUMN id SET DEFAULT nextval('public.merchants_id_seq'::regclass);


--
-- Name: payables id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.payables ALTER COLUMN id SET DEFAULT nextval('public.payables_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: merchants merchants_pk; Type: CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pk PRIMARY KEY (id);


--
-- Name: payables payables_pk; Type: CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.payables
    ADD CONSTRAINT payables_pk PRIMARY KEY (id);


--
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);


--
-- Name: merchants_name_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE UNIQUE INDEX merchants_name_idx ON public.merchants USING btree (name);


--
-- Name: payables_create_date_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX payables_create_date_idx ON public.payables USING btree (create_date);


--
-- Name: payables_merchant_id_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX payables_merchant_id_idx ON public.payables USING btree (merchant_id);


--
-- Name: payables_merchant_status_date_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX payables_merchant_status_date_idx ON public.payables USING btree (merchant_id, status, create_date);


--
-- Name: payables_status_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX payables_status_idx ON public.payables USING btree (status);


--
-- Name: payables_transaction_id_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE UNIQUE INDEX payables_transaction_id_idx ON public.payables USING btree (transaction_id);


--
-- Name: transactions_merchant_id_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX transactions_merchant_id_idx ON public.transactions USING btree (merchant_id);


--
-- Name: transactions_payment_merchant_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX transactions_payment_merchant_idx ON public.transactions USING btree (payment_method, merchant_id);


--
-- Name: transactions_payment_method_idx; Type: INDEX; Schema: public; Owner: dbuser
--

CREATE INDEX transactions_payment_method_idx ON public.transactions USING btree (payment_method);


--
-- Name: payables payables_merchants_fk; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.payables
    ADD CONSTRAINT payables_merchants_fk FOREIGN KEY (merchant_id) REFERENCES public.merchants(id);


--
-- Name: payables payables_transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.payables
    ADD CONSTRAINT payables_transactions_fk FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);


--
-- Name: transactions transactions_merchants_fk; Type: FK CONSTRAINT; Schema: public; Owner: dbuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_merchants_fk FOREIGN KEY (merchant_id) REFERENCES public.merchants(id);


--
-- PostgreSQL database dump complete
--

