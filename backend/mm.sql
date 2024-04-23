\echo 'Delete and recreate Money Manager db?'
\prompt 'Return for yes or control-C to cancel > ' foo







DROP DATABASE moneymanager;
CREATE DATABASE moneymanager;
\connect moneymanager

\i mm-schema.sql
\i mm-seed.sql

\echo 'Delete and recreate mm_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mm_test;
CREATE DATABASE mm_test;
\connect mm_test

\i mm-schema.sql
