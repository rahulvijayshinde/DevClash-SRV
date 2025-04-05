-- SQL to set up the medical_records table in Supabase
-- Run this in the Supabase SQL Editor

-- First check if the table already exists to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'medical_records') THEN
        -- Create the medical_records table
        CREATE TABLE public.medical_records (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES public.custom_users(id),
            allergies TEXT,
            medications TEXT,
            conditions TEXT,
            surgeries TEXT,
            family_history TEXT,
            blood_type TEXT,
            height TEXT,
            weight TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id)
        );

        -- Add comment for the table
        COMMENT ON TABLE public.medical_records IS 'Medical records for users';
        
        -- Create index on user_id for faster lookups
        CREATE INDEX idx_medical_records_user_id ON public.medical_records(user_id);
        
        -- Enable Row Level Security (RLS)
        ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
        
        -- Grant access to the anon role (which is used by the supabase-js client)
        GRANT SELECT, INSERT, UPDATE ON public.medical_records TO anon;
        
        -- Create a policy that allows reading/writing to all authenticated users
        -- NOTE: For a real app, you'd want more restrictive policies
        CREATE POLICY "Allow full access" ON public.medical_records 
            USING (true) 
            WITH CHECK (true);
    END IF;
END
$$; 