CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  plaid_token TEXT,
  auth_token TEXT,
  account_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE transactions (
  transaction_id TEXT PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  merchant_name text,
  amount numeric(28,10) NOT NULL,
  days_requested integer,
  iso_currency_code text,
  date date NOT NULL,
  counterparties_name text,
  CONSTRAINT unique_transaction UNIQUE (transaction_id)
);

CREATE TABLE accounts(
  account_id TEXT PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  balance numeric(28, 10) NOT NULL,
  name text NOT NULL,
  type text NOT NULL
);
