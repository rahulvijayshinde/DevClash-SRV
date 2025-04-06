import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// Internal function to validate URL
function validateSupabaseUrl(url: string | undefined): string {
  if (!url) {
    throw new Error('URL is undefined or empty');
  }
  
  // Check if URL has a protocol, add https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  try {
    // Test if URL is valid by constructing a URL object
    new URL(url);
    return url;
  } catch (error) {
    console.error('Invalid URL format:', url);
    throw new Error(`Invalid URL format: ${url}`);
  }
}

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate URL format with proper error handling
let validatedURL: string;
try {
  validatedURL = validateSupabaseUrl(SUPABASE_URL);
} catch (error) {
  console.error('API route: Supabase URL validation error:', error);
  // Fallback to a default structure in case of error
  validatedURL = 'https://example.supabase.co';
}

// Create a Supabase client with service role key (has admin privileges)
const supabaseAdmin = createClient(
  validatedURL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

// Debug log the service key (partial)
console.log('API route: Service key present:', Boolean(SUPABASE_SERVICE_KEY));
console.log('API route: Service key length:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.length : 0);

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const appointmentData = await request.json();
    
    console.log('API route received appointment data:', JSON.stringify(appointmentData, null, 2));
    
    // Validate required fields
    if (!appointmentData.user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }
    
    if (!appointmentData.specialist_id) {
      return NextResponse.json({ error: 'specialist_id is required' }, { status: 400 });
    }
    
    if (!appointmentData.appointment_date) {
      return NextResponse.json({ error: 'appointment_date is required' }, { status: 400 });
    }
    
    if (!appointmentData.appointment_time) {
      return NextResponse.json({ error: 'appointment_time is required' }, { status: 400 });
    }
    
    // Test connection first to ensure service role is working
    try {
      const { data: testData, error: testError } = await supabaseAdmin
        .from('appointments')
        .select('count')
        .limit(1);
        
      if (testError) {
        console.error('API route: Connection test failed:', testError);
        return NextResponse.json({ 
          error: `Database connection test failed: ${testError.message}` 
        }, { status: 500 });
      }
      
      console.log('API route: Connection test successful');
    } catch (testError) {
      console.error('API route: Unexpected error during connection test:', testError);
      return NextResponse.json({ 
        error: 'Database connection test failed with unexpected error' 
      }, { status: 500 });
    }
    
    // Insert appointment using service role (bypasses RLS)
    console.log('API route: Attempting to insert appointment with service role...');
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert(appointmentData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating appointment from API:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Appointment created successfully from API:', data);
    
    // Return the appointment ID
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in appointment API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    // Fetch all appointments for the given user
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in appointment API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 