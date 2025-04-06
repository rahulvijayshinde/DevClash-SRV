import { NextResponse } from 'next/server';

// This is for debugging only - remove in production
export async function GET() {
  // Get the first part of sensitive values for debugging
  const supabaseUrlStart = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 12) + '...'
    : 'undefined';
  
  const anonKeyStart = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 12) + '...'
    : 'undefined';
  
  const serviceKeyStart = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 12) + '...'
    : 'undefined';
  
  return NextResponse.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL_START: supabaseUrlStart,
      ANON_KEY_START: anonKeyStart,
      SERVICE_KEY_START: serviceKeyStart,
      // Check if we have full URLs or not
      HAS_FULL_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      HAS_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      HAS_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    }
  });
} 