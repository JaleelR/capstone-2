\echo 'Delete and recreate mm_production db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mm_production;
CREATE DATABASE mm_production;
\connect mm_production; 

\i mm-schema.sql
\i mm-seed.sql

\echo 'Delete and recreate mm_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mm_test;
CREATE DATABASE mm_test;
\connect mm_test

\i mm-schema.sql

\echo 'Delete and recreate mm_development db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mm_development;
CREATE DATABASE mm_development;
\connect mm_development; 

\i mm-schema.sql;
`