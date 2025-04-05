-- SQL to set up the custom_users table in Supabase with medical fields
-- Run this in the Supabase SQL Editor

-- First check if the table already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'custom_users') THEN
        -- Create the custom_users table with all profile and medical fields
        CREATE TABLE public.custom_users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            full_name TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT,
            date_of_birth TEXT,
            emergency_contact_name TEXT,
            emergency_contact_phone TEXT,
            -- Medical information fields
            allergies TEXT,
            medications TEXT,
            conditions TEXT,
            surgeries TEXT,
            family_history TEXT,
            blood_type TEXT,
            height TEXT,
            weight TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add comment for the table
        COMMENT ON TABLE public.custom_users IS 'Custom user table with profile and medical information';
        
        -- Create index on email for faster lookups
        CREATE INDEX idx_custom_users_email ON public.custom_users(email);
        
        -- Enable Row Level Security (RLS)
        ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;
        
        -- Grant access to the anon role (which is used by the supabase-js client)
        GRANT SELECT, INSERT, UPDATE ON public.custom_users TO anon;
        
        -- Create a policy that allows reading/writing to all authenticated users
        -- NOTE: For a real app, you'd want more restrictive policies
        CREATE POLICY "Allow full access" ON public.custom_users 
            USING (true) 
            WITH CHECK (true);
    ELSE
        -- If the table exists, add the medical fields if they don't exist
        -- Check and add each medical field if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'allergies') THEN
            ALTER TABLE public.custom_users ADD COLUMN allergies TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'medications') THEN
            ALTER TABLE public.custom_users ADD COLUMN medications TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'conditions') THEN
            ALTER TABLE public.custom_users ADD COLUMN conditions TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'surgeries') THEN
            ALTER TABLE public.custom_users ADD COLUMN surgeries TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'family_history') THEN
            ALTER TABLE public.custom_users ADD COLUMN family_history TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'blood_type') THEN
            ALTER TABLE public.custom_users ADD COLUMN blood_type TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'height') THEN
            ALTER TABLE public.custom_users ADD COLUMN height TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'custom_users' AND column_name = 'weight') THEN
            ALTER TABLE public.custom_users ADD COLUMN weight TEXT;
        END IF;
    END IF;
END
$$; 