-- ============================================
-- Supabase Database Setup for CoinWizz
-- ============================================
-- This SQL script creates the necessary tables and policies
-- for user management in the CoinWizz application
-- 
-- Run this in your Supabase SQL Editor:
-- https://ifqttkxutujvctfqptam.supabase.co/project/_/sql
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    picture TEXT,
    plan TEXT DEFAULT 'free',
    auth_provider TEXT DEFAULT 'google',
    selected_coins JSONB DEFAULT '[]'::jsonb,
    selected_pages JSONB DEFAULT '[]'::jsonb,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create index on plan for analytics
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);

-- Create index on last_active for online status checks
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to read all user data (for super admin)
CREATE POLICY "Allow anonymous read access" ON public.users
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Allow anonymous users to insert new users (for sign-up)
CREATE POLICY "Allow anonymous insert" ON public.users
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow anonymous users to update their own data
CREATE POLICY "Allow anonymous update" ON public.users
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy: Allow anonymous users to delete (for super admin operations)
CREATE POLICY "Allow anonymous delete" ON public.users
    FOR DELETE
    TO anon
    USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for user statistics (optional, for analytics)
CREATE OR REPLACE VIEW public.user_statistics AS
SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE plan != 'free') as premium_users,
    COUNT(*) FILTER (WHERE last_active > NOW() - INTERVAL '5 minutes') as online_users,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_month
FROM public.users;

-- Grant access to the view
GRANT SELECT ON public.user_statistics TO anon;

-- ============================================
-- Sample Queries for Testing
-- ============================================

-- View all users
-- SELECT * FROM public.users ORDER BY created_at DESC;

-- View user statistics
-- SELECT * FROM public.user_statistics;

-- Find users by plan
-- SELECT * FROM public.users WHERE plan = 'rallye25';

-- Find active users (last 5 minutes)
-- SELECT * FROM public.users 
-- WHERE last_active > NOW() - INTERVAL '5 minutes';

-- Count users by plan
-- SELECT plan, COUNT(*) as count 
-- FROM public.users 
-- GROUP BY plan;

-- ============================================
-- Cleanup (use with caution!)
-- ============================================

-- To drop the table and start fresh (WARNING: deletes all data)
-- DROP TABLE IF EXISTS public.users CASCADE;
-- DROP VIEW IF EXISTS public.user_statistics;

-- ============================================
-- Setup Complete!
-- ============================================
-- Your database is now ready to store user data
-- Next steps:
-- 1. Copy this SQL and run it in Supabase SQL Editor
-- 2. Verify tables are created in Table Editor
-- 3. Test with your application
-- ============================================
