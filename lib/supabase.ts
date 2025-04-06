import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

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
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug log - environment variables
console.log('Environment variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL present:', Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log('- NEXT_PUBLIC_SUPABASE_URL value (partial):', SUPABASE_URL ? SUPABASE_URL.substring(0, 12) + '...' : 'empty');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY present:', Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

// Check if variables are present
if (!SUPABASE_URL) {
  console.error('CRITICAL ERROR: Missing Supabase URL');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!SUPABASE_ANON_KEY) {
  console.error('CRITICAL ERROR: Missing Supabase Anon Key');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Validate URL format with proper error handling
let validatedURL;
try {
  validatedURL = validateSupabaseUrl(SUPABASE_URL);
  console.log('Supabase URL validated:', validatedURL);
} catch (error) {
  console.error('Supabase URL validation error:', error);
  // Fallback to a default structure in case of error
  validatedURL = 'https://example.supabase.co';
}

// Initialize Supabase with validated URL
export const supabase = createClient(
  validatedURL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        'x-application-name': 'mediconnect',
      },
    },
  }
)

// User type definition for our custom auth
export interface CustomUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  // Medical information fields
  allergies?: string | null;
  medications?: string | null;
  conditions?: string | null;
  surgeries?: string | null;
  family_history?: string | null;
  blood_type?: string | null;
  height?: string | null;
  weight?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Hash a password with SHA-256
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Store user in localStorage and cookies
function storeUserLocally(user: CustomUser): void {
  if (typeof window !== 'undefined') {
    // Store in localStorage for app use
    localStorage.setItem('custom_user', JSON.stringify(user));
    
    // Also store in cookies for middleware
    document.cookie = `custom_user=${JSON.stringify(user)}; path=/; max-age=2592000`; // 30 days
  }
}

// Clear user from localStorage and cookies
function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('custom_user');
    document.cookie = 'custom_user=; path=/; max-age=0';
  }
}

// Get user from localStorage
export function getLocalUser(): CustomUser | null {
  try {
    if (typeof window !== 'undefined') {
      // Check if localStorage is available
      if (!window.localStorage) {
        console.warn('localStorage is not available');
        return null;
      }
      
      const userStr = localStorage.getItem('custom_user');
      if (!userStr) {
        // No user in localStorage
        return null;
      }
      
      try {
        const user = JSON.parse(userStr);
        // Validate that it looks like a user object
        if (user && typeof user === 'object' && 'id' in user && 'email' in user) {
          return user;
        } else {
          console.warn('Invalid user object format in localStorage');
          return null;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        // Clear the invalid data
        localStorage.removeItem('custom_user');
        return null;
      }
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in getLocalUser:', error);
  }
  return null;
}

// Try to import uuid, but provide a fallback if it fails
let uuidv4: () => string;
try {
  // Try to import from uuid package
  const uuidModule = require('uuid');
  uuidv4 = uuidModule.v4;
} catch (error) {
  // Fallback implementation if uuid package is not available
  console.warn('uuid package not found, using fallback implementation');
  uuidv4 = () => {
    const hexChars = '0123456789abcdef';
    let uuid = '';
    
    // Generate a v4 UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4'; // Version 4 UUID always has a 4 in this position
      } else if (i === 19) {
        // Version 4 UUID has a random number from 8-B in this position
        uuid += hexChars[Math.floor(Math.random() * 4) + 8];
      } else {
        uuid += hexChars[Math.floor(Math.random() * 16)];
      }
    }
    
    return uuid;
  };
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  metadata?: { [key: string]: any }
): Promise<{ user: CustomUser | null; error: string | null }> => {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { user: null, error: 'User with this email already exists' };
    }

    // Hash the password
    const password_hash = hashPassword(password);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password_hash,
      full_name: metadata?.full_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('custom_users')
      .insert(newUser);

    if (error) throw error;

    // Return user without password hash
    const user: CustomUser = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name
    };

    // Store user in localStorage
    storeUserLocally(user);
    
    return { user, error: null };
  } catch (error) {
    console.error("Signup error:", error);
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<{ user: CustomUser | null; error: string | null }> => {
  try {
    // Hash the password for comparison
    const password_hash = hashPassword(password);

    // Find user
    const { data, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    
    if (!data) {
      return { user: null, error: 'User not found' };
    }

    // Check password
    if (data.password_hash !== password_hash) {
      return { user: null, error: 'Invalid password' };
    }

    // Return user without password hash
    const user: CustomUser = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      date_of_birth: data.date_of_birth,
      emergency_contact_name: data.emergency_contact_name,
      emergency_contact_phone: data.emergency_contact_phone,
      // Add medical information fields
      allergies: data.allergies,
      medications: data.medications,
      conditions: data.conditions,
      surgeries: data.surgeries,
      family_history: data.family_history,
      blood_type: data.blood_type,
      height: data.height,
      weight: data.weight
    };

    // Store user in localStorage
    storeUserLocally(user);
    
    return { user, error: null };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    clearUserData();
    return { error: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<CustomUser>
): Promise<{ user: CustomUser | null; error: string | null }> => {
  try {
    console.log('Updating profile for user ID:', userId);
    console.log('Profile data to update:', profileData);
    
    // Don't allow updating password through this function
    const { email, ...otherData } = profileData;
    
    // Add updated_at timestamp
    const updates = {
      ...otherData,
      updated_at: new Date().toISOString()
    };

    // If it's the default user, create a new record instead of updating
    if (userId === 'default-user') {
      console.log('Creating new user profile with default ID');
      
      // Generate a real UUID for the new user
      const newUserId = uuidv4();
      
      const newUser = {
        id: newUserId,
        email: email || 'guest@example.com',
        ...updates
      };
      
      const { data, error } = await supabase
        .from('custom_users')
        .insert(newUser)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating new user:', error);
        throw error;
      }
      
      console.log('Created new user:', data);
      
      // Update stored user with the real ID
      const user: CustomUser = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        date_of_birth: data.date_of_birth,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        // Add medical information fields
        allergies: data.allergies,
        medications: data.medications,
        conditions: data.conditions,
        surgeries: data.surgeries,
        family_history: data.family_history,
        blood_type: data.blood_type,
        height: data.height,
        weight: data.weight
      };
      
      // Store user in localStorage with the new ID
      storeUserLocally(user);
      
      return { user, error: null };
    }
    
    // Normal case - update existing user
    console.log('Updating existing user profile');
    const { data, error } = await supabase
      .from('custom_users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    if (!data) {
      console.error('No user found with ID:', userId);
      return { user: null, error: 'User not found' };
    }

    console.log('Updated user data:', data);
    
    // Return updated user without password hash
    const user: CustomUser = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      city: data.city, 
      state: data.state,
      zip_code: data.zip_code,
      date_of_birth: data.date_of_birth,
      emergency_contact_name: data.emergency_contact_name,
      emergency_contact_phone: data.emergency_contact_phone,
      // Add medical information fields
      allergies: data.allergies,
      medications: data.medications,
      conditions: data.conditions,
      surgeries: data.surgeries,
      family_history: data.family_history,
      blood_type: data.blood_type,
      height: data.height,
      weight: data.weight
    };

    // Update stored user
    storeUserLocally(user);
    
    return { user, error: null };
  } catch (error) {
    console.error("Profile update error:", error);
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Update user password
export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    console.log('Attempting password update for user ID:', userId);

    // Hash the passwords
    const currentPasswordHash = hashPassword(currentPassword);
    const newPasswordHash = hashPassword(newPassword);
    
    // First verify the current password
    const { data: userData, error: fetchError } = await supabase
      .from('custom_users')
      .select('password_hash')
      .eq('id', userId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching user for password verification:', fetchError);
      throw fetchError;
    }
    
    if (!userData) {
      console.error('No user found with ID:', userId);
      return { success: false, error: 'User not found' };
    }
    
    // Verify current password
    if (userData.password_hash !== currentPasswordHash) {
      console.error('Current password is incorrect');
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Update the password
    const { error: updateError } = await supabase
      .from('custom_users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating password:', updateError);
      throw updateError;
    }
    
    console.log('Password updated successfully for user ID:', userId);
    return { success: true, error: null };
  } catch (error) {
    console.error("Password update error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Interface for appointment data
export interface AppointmentData {
  user_id: string;
  specialist_type: string;
  specialist_id: string;
  specialist_name: string;
  appointment_date: Date;
  appointment_time: string;
  reason: string;
  notes?: string;
  status?: string;
}

// Book an appointment
export const bookAppointment = async (
  appointmentData: AppointmentData
): Promise<{ success: boolean; error: string | null; appointmentId?: string }> => {
  try {
    console.log("Booking appointment with data:", JSON.stringify(appointmentData, null, 2));
    
    // Ensure user_id is in proper UUID format
    let userId = appointmentData.user_id;
    
    // Check if userId is a valid UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(userId)) {
      console.error("Invalid UUID format for user_id:", userId);
      return {
        success: false,
        error: `Invalid user ID format. Expected UUID, got: ${userId}`
      };
    }
    
    // Format the date - must be in YYYY-MM-DD format for PostgreSQL DATE type
    const formattedDate = appointmentData.appointment_date instanceof Date 
      ? appointmentData.appointment_date.toISOString().split('T')[0]
      : new Date(appointmentData.appointment_date).toISOString().split('T')[0];
    
    // Make sure time is in proper format (HH:MM)
    const timePattern = /^\d{2}:\d{2}$/;
    const formattedTime = timePattern.test(appointmentData.appointment_time)
      ? appointmentData.appointment_time
      : appointmentData.appointment_time + ":00";
    
    // Create appointment record
    const appointmentRecord = {
      id: uuidv4(), // Generate UUID for the appointment
      user_id: userId,
      specialist_type: appointmentData.specialist_type,
      specialist_id: appointmentData.specialist_id,
      specialist_name: appointmentData.specialist_name,
      appointment_date: formattedDate,
      appointment_time: formattedTime,
      reason: appointmentData.reason,
      notes: appointmentData.notes || null,
      status: appointmentData.status || 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Formatted appointment data:", JSON.stringify(appointmentRecord, null, 2));
    
    // First, check if this appointment already exists to avoid duplicates
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', userId)
      .eq('specialist_id', appointmentData.specialist_id)
      .eq('appointment_date', formattedDate)
      .eq('appointment_time', formattedTime)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing appointment:", checkError);
      return {
        success: false,
        error: `Error checking for existing appointment: ${checkError.message}`
      };
    }
      
    if (existingAppointment) {
      console.log("Appointment already exists:", existingAppointment);
      return {
        success: true,
        error: null,
        appointmentId: existingAppointment.id,
      };
    }

    // Due to RLS issues, we'll use the API endpoint directly instead of trying direct insertion first
    console.log("Using API endpoint to create appointment (bypassing RLS)...");
    
    try {
      // Call our API route that uses the service role key
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentRecord)
      });
      
      // Log response status
      console.log(`API response status: ${response.status} ${response.statusText}`);
      
      // Handle API response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
        }
      }
      
      // Parse successful response
      const responseData = await response.json();
      console.log("API response data:", responseData);
      
      if (!responseData.id) {
        console.error("API response missing appointment ID");
        throw new Error("API response missing appointment ID");
      }
      
      // Appointment was created successfully, now send email notification
      await sendEmailNotification(appointmentData, responseData.id);
      
      return {
        success: true,
        error: null,
        appointmentId: responseData.id
      };
    } catch (error) {
      console.error("Error using API endpoint:", error);
      throw error;
    }
  } catch (error) {
    console.error("Appointment booking error:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : (typeof error === 'object' && error !== null && 'message' in error)
        ? String(error.message)
        : 'An unknown error occurred';
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Helper function to send email notification for a new appointment
async function sendEmailNotification(appointmentData: AppointmentData, appointmentId: string) {
  try {
    console.log("Sending email notification for appointment:", appointmentId);
    
    // Use dynamic import to avoid circular dependencies
    const emailService = await import('./email-service');
    
    // Send the notification email using our sendEmailNotification function from the service
    const result = await emailService.sendEmailNotification(appointmentData, appointmentId);
    
    console.log("Email notification results:", result);
    
    return result;
  } catch (error) {
    // Don't let email errors affect the appointment booking process
    console.error("Error sending appointment notification email:", error);
    return {
      doctorEmailSent: false,
      patientEmailSent: false
    };
  }
}

// Get user appointments
export const getUserAppointments = async (
  userId: string
): Promise<{ appointments: any[] | null; error: string | null }> => {
  try {
    console.log('getUserAppointments called with userId:', userId);
    
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided:', userId);
      return { appointments: null, error: 'Invalid user ID' };
    }
    
    // Log the query we're about to execute
    console.log(`Executing query: SELECT * FROM appointments WHERE user_id = '${userId}'`);
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Log the results
    console.log('Query results:', { count: data?.length || 0, firstItem: data?.[0] || null });
    
    return { appointments: data, error: null };
  } catch (error) {
    console.error("Get appointments error:", error);
    return { 
      appointments: null, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Update appointment status error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

// Create an appointment
export const createAppointment = async (
  appointmentData: {
    user_id: string,
    specialist_type: string,
    specialist_name: string,
    appointment_date: string,
    appointment_time: string,
    reason: string,
    notes?: string,
    status?: string
  }
): Promise<{ success: boolean; error: string | null; appointment_id?: string }> => {
  try {
    console.log('Creating appointment with data:', appointmentData);
    
    if (!appointmentData.user_id) {
      return { success: false, error: 'User ID is required' };
    }

    // Set default status if not provided
    if (!appointmentData.status) {
      appointmentData.status = 'scheduled';
    }

    // Add created_at timestamp
    const appointmentWithTimestamp = {
      ...appointmentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentWithTimestamp)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    console.log('Successfully created appointment:', data);
    
    return { 
      success: true, 
      error: null,
      appointment_id: data?.id
    };
  } catch (error) {
    console.error("Appointment creation error:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : (typeof error === 'object' && error !== null && 'message' in error)
        ? String(error.message)
        : 'An unknown error occurred';
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};