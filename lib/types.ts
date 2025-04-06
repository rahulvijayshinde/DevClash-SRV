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

// Interface for appointment data
export interface AppointmentData {
  user_id: string;
  specialist_type: string;
  specialist_id: string;
  specialist_name: string;
  appointment_date: string | Date;
  appointment_time: string;
  reason: string;
  notes?: string;
  status?: string;
}

// Interface for health metrics data
export interface HealthMetricsData {
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string | Date;
  notes?: string;
}

// Interface for medical records
export interface MedicalRecord {
  id: string;
  user_id: string;
  record_type: string;
  title: string;
  description: string;
  date: string | Date;
  provider?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
} 