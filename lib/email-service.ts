import { Resend } from 'resend';
import { AppointmentData } from './types';
import { supabase } from './supabase';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'notifications@mediconnect.com';

// Log Resend API key status (don't log the actual key)
console.log('Email service: Resend API key present:', Boolean(process.env.RESEND_API_KEY));
console.log('Email service: Resend API key length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);

/**
 * Formats appointment date and time for display in emails
 */
const formatAppointmentDateTime = (date: string | Date, time: string): string => {
  const appointmentDate = new Date(date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
  
  // Format time (convert from 24-hour to 12-hour format if needed)
  let formattedTime = time;
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    formattedTime = `${hour12}:${minutes} ${ampm}`;
  }
  
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Fetches user profile data from Supabase
 */
async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('custom_users')
      .select('email, full_name')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
}

/**
 * Sends email notification to the patient about their appointment
 */
export async function sendPatientNotification(
  userEmail: string, 
  userName: string,
  appointment: AppointmentData
) {
  console.log(`Sending patient notification email to: ${userEmail}`);
  
  const formattedDateTime = formatAppointmentDateTime(
    appointment.appointment_date,
    appointment.appointment_time
  );
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'Your MediConnect Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">MediConnect Appointment Confirmation</h2>
          <p>Hello ${userName},</p>
          <p>Your appointment has been successfully scheduled.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Appointment Details:</strong></p>
            <p><strong>Date & Time:</strong> ${formattedDateTime}</p>
            <p><strong>Specialist:</strong> ${appointment.specialist_name} (${appointment.specialist_type})</p>
            <p><strong>Reason:</strong> ${appointment.reason}</p>
            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          </div>
          
          <p>You can view and manage your appointments through your MediConnect dashboard.</p>
          <p>If you need to reschedule or cancel, please do so at least 24 hours before your appointment.</p>
          
          <p style="margin-top: 30px;">Thank you for choosing MediConnect for your healthcare needs.</p>
          <p>Best regards,<br>The MediConnect Team</p>
        </div>
      `
    });
    
    if (error) {
      console.error('Error sending patient notification email:', error);
      return { success: false, error };
    }
    
    console.log('Patient notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending patient notification email:', error);
    return { success: false, error };
  }
}

/**
 * Sends email notification to the doctor about a new appointment
 */
export async function sendDoctorNotification(
  doctorEmail: string,
  doctorName: string,
  appointment: AppointmentData,
  patientName: string
) {
  console.log(`Sending doctor notification email to: ${doctorEmail}`);
  
  const formattedDateTime = formatAppointmentDateTime(
    appointment.appointment_date,
    appointment.appointment_time
  );
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: doctorEmail,
      subject: 'New MediConnect Patient Appointment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Patient Appointment</h2>
          <p>Hello Dr. ${doctorName},</p>
          <p>A new patient appointment has been scheduled with you.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Appointment Details:</strong></p>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Date & Time:</strong> ${formattedDateTime}</p>
            <p><strong>Reason:</strong> ${appointment.reason}</p>
            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          </div>
          
          <p>You can view your complete schedule through your MediConnect dashboard.</p>
          
          <p style="margin-top: 30px;">Thank you for your continued service with MediConnect.</p>
          <p>Best regards,<br>The MediConnect Team</p>
        </div>
      `
    });
    
    if (error) {
      console.error('Error sending doctor notification email:', error);
      return { success: false, error };
    }
    
    console.log('Doctor notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending doctor notification email:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification for a new appointment to both patient and doctor
 */
export async function sendEmailNotification(appointmentData: AppointmentData, appointmentId: string) {
  console.log(`Processing email notifications for appointment ID: ${appointmentId}`);
  
  try {
    // Get the patient's details from Supabase
    const userProfile = await getUserProfile(appointmentData.user_id);
    
    if (!userProfile) {
      console.error('Failed to fetch user profile for email notification');
      return {
        doctorEmailSent: false,
        patientEmailSent: false
      };
    }
    
    const userEmail = userProfile.email;
    const userName = userProfile.full_name || 'Patient';
    
    // Get the doctor's email (in a real app, you'd fetch this from your database)
    // This is a simplified example - implement your actual doctor email retrieval
    const doctorEmail = `doctor-${appointmentData.specialist_id}@mediconnect.com`;
    
    // Send notifications to both patient and doctor
    const patientResult = await sendPatientNotification(
      userEmail,
      userName,
      appointmentData
    );
    
    const doctorResult = await sendDoctorNotification(
      doctorEmail,
      appointmentData.specialist_name,
      appointmentData,
      userName
    );
    
    return {
      doctorEmailSent: doctorResult.success,
      patientEmailSent: patientResult.success
    };
  } catch (error) {
    console.error('Exception in sendEmailNotification:', error);
    return {
      doctorEmailSent: false,
      patientEmailSent: false
    };
  }
}

/**
 * Main function to send notifications for a new appointment
 * This function is exposed for API calls and handles getting appointment data
 */
export async function sendAppointmentNotifications(appointmentId: string) {
  console.log(`Processing notifications for appointment ID: ${appointmentId}`);
  
  try {
    // Get the appointment details from the database
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
    
    if (appointmentError || !appointments) {
      console.error('Error fetching appointment details:', appointmentError);
      return { success: false, error: appointmentError?.message || 'Appointment not found' };
    }
    
    // Send the email notifications
    const emailResults = await sendEmailNotification(appointments, appointmentId);
    
    return {
      success: emailResults.doctorEmailSent || emailResults.patientEmailSent,
      ...emailResults
    };
  } catch (error) {
    console.error('Exception in sendAppointmentNotifications:', error);
    return { success: false, error };
  }
} 