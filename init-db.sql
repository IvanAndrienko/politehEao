-- Initial database setup for Politech-EAO
-- This file runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Create user if it doesn't exist (handled by POSTGRES_USER env var)

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE politeh TO politeh_user;

-- Connect to the database
\c politeh;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO politeh_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO politeh_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO politeh_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO politeh_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO politeh_user;