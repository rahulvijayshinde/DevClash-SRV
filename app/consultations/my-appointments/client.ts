import { createClient } from '@supabase/supabase-js';

// Special version of the Supabase client just for the appointments page
// This prevents circular dependency issues that might be happening

// Helper function to safely create a URL
function createValidUrl(url: string): string {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

// Create Supabase client with extra safety checks
export function createSafeSupabaseClient() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Log what we have
    console.log('My Appointments page - Creating Supabase client');
    console.log('URL defined:', Boolean(supabaseUrl));
    console.log('Key defined:', Boolean(supabaseKey));
    
    // Return null if missing credentials
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in appointments page');
      return null;
    }
    
    // Format URL
    const validUrl = createValidUrl(supabaseUrl);
    
    // Create client
    return createClient(validUrl, supabaseKey);
  } catch (error) {
    console.error('Error creating Supabase client in appointments page:', error);
    return null;
  }
}

// Helper function to get user appointments with fallback error handling
export async function getAppointments(userId: string) {
  try {
    const client = createSafeSupabaseClient();
    
    // If client creation failed, return empty results
    if (!client) {
      return { appointments: [], error: 'Could not initialize database connection' };
    }
    
    const { data, error } = await client
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching appointments:', error);
      return { appointments: [], error: error.message };
    }
    
    return { appointments: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching appointments:', error);
    return { 
      appointments: [], 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
} 