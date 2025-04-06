-- SQL to set up the appointments table in Supabase
-- Run this in the Supabase SQL Editor

-- First check if the table already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        -- Create the appointments table
        CREATE TABLE public.appointments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES public.custom_users(id),
            specialist_type TEXT NOT NULL,
            specialist_id TEXT NOT NULL,
            specialist_name TEXT NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TEXT NOT NULL,
            reason TEXT NOT NULL,
            notes TEXT,
            status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add comment for the table
        COMMENT ON TABLE public.appointments IS 'Appointment bookings for teleconsultations';
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
        CREATE INDEX idx_appointments_specialist_id ON public.appointments(specialist_id);
        CREATE INDEX idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);
        CREATE INDEX idx_appointments_status ON public.appointments(status);
        
        -- Enable Row Level Security (RLS)
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
        
        -- Grant access to the anon role (which is used by the supabase-js client)
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO anon;
        
        -- TEMPORARY: Create a policy that allows all operations without authentication checks
        -- !!! SECURITY WARNING: For debugging only, remove in production !!!
        CREATE POLICY "Allow all operations" ON public.appointments 
            USING (true) 
            WITH CHECK (true);

        -- COMMENTED OUT UNTIL WORKING: These are the proper policies to use once working
        /*
        -- Create a policy that allows reading all appointments
        CREATE POLICY "Allow users to view their own appointments" ON public.appointments 
            FOR SELECT
            USING (user_id = auth.uid() OR specialist_id = auth.uid()::text);
            
        -- Create a policy that allows inserting appointments
        CREATE POLICY "Allow users to create appointments" ON public.appointments 
            FOR INSERT
            WITH CHECK (true);
            
        -- Create a policy that allows updating own appointments
        CREATE POLICY "Allow users to update their own appointments" ON public.appointments 
            FOR UPDATE
            USING (user_id = auth.uid() OR specialist_id = auth.uid()::text);
            
        -- Create a policy that allows deleting own appointments
        CREATE POLICY "Allow users to delete their own appointments" ON public.appointments 
            FOR DELETE
            USING (user_id = auth.uid());
        */
    END IF;
END
$$; 