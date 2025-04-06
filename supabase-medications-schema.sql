-- Medications table SQL schema for Supabase

-- Creating the medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time TEXT NOT NULL,
  instructions TEXT,
  reminders BOOLEAN DEFAULT TRUE,
  adherence INTEGER DEFAULT 100,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);

-- RLS is disabled by default, so this table will be accessible
-- without policies until you explicitly enable RLS 