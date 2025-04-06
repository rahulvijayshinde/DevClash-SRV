// Email service using Resend API
import { format } from 'date-fns';

// Type definition for appointment notification email
interface AppointmentEmailData {
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
}

// Send email notification for new appointment
export async function sendAppointmentNotification(appointmentData: AppointmentEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify required data is present
    if (!appointmentData.doctorName || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      return { success: false, error: 'Missing required appointment data for email' };
    }

    // Format the date for better readability
    const formattedDate = format(new Date(appointmentData.appointmentDate), 'MMMM d, yyyy');
    
    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px;">
        <h1 style="color: #3b82f6; margin-bottom: 20px;">New Appointment Notification</h1>
        
        <p>Hello Dr. ${appointmentData.doctorName},</p>
        
        <p>You have a new appointment scheduled with ${appointmentData.patientName || 'a patient'}.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Appointment Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${appointmentData.appointmentTime}</p>
          <p><strong>Reason:</strong> ${appointmentData.reason}</p>
          ${appointmentData.notes ? `<p><strong>Notes:</strong> ${appointmentData.notes}</p>` : ''}
        </div>
        
        <p>Please log in to the Telemedicine platform to view more details and prepare for the appointment.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p>This is an automated message from the Telemedicine Platform.</p>
        </div>
      </div>
    `;

    // Prepare email data for Resend API
    const emailData = {
      from: 'notifications@telemedicine-platform.com',
      to: 'vivekvmule@gmail.com', // Fixed recipient as requested
      subject: `New Appointment with ${appointmentData.patientName || 'a patient'} on ${formattedDate}`,
      html: htmlContent,
    };

    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData),
    });

    // Parse response
    const result = await response.json();

    // Check if email was sent successfully
    if (!response.ok) {
      console.error('Failed to send email notification:', result);
      return { 
        success: false, 
        error: result.message || 'Failed to send email notification' 
      };
    }

    console.log('Appointment notification email sent successfully:', result);
    return { success: true };

  } catch (error) {
    console.error('Error sending appointment notification email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sending email'
    };
  }
} 