import { createClient } from '@supabase/supabase-js'

// Create a simple Supabase client for testing
let supabase;

try {
  // Get URL from environment
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Simple client - URL present:', Boolean(url));
  console.log('Simple client - Key present:', Boolean(key));
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }
  
  // Add https:// if needed
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Create client
  supabase = createClient(formattedUrl, key);
  console.log('Simple Supabase client created successfully');
} catch (error) {
  console.error('Error creating simple Supabase client:', error);
  // Create a dummy client that will throw errors when used
  supabase = {
    from: () => {
      throw new Error('Supabase client not properly initialized');
    }
  };
}

export { supabase } 