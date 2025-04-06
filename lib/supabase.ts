import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Initialize Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('custom_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
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