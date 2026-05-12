-- Bryant Labs internal/test analytics exclusion for Supabase Auth users
-- Set on approved admin or test accounts in Supabase Auth user metadata.

-- Example app metadata:
-- { "is_internal": true }
--
-- Example user metadata:
-- { "is_test_account": true }

-- The client analytics guard reads app_metadata and user_metadata for:
-- is_internal
-- is_test_account
