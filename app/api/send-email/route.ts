import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentNotification } from '@/lib/email';

// API route to send appointment email notifications
export async function POST(request: NextRequest) {
  try {
    // Get email data from request body
    const emailData = await request.json();
    
    // Validate required fields
    if (!emailData.doctorName || !emailData.appointmentDate || !emailData.appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required fields for email notification' },
        { status: 400 }
      );
    }
    
    // Log the request for debugging
    console.log('Received email notification request:', emailData);
    
    // Send the email
    const result = await sendAppointmentNotification(emailData);
    
    if (!result.success) {
      console.error('Error in API route when sending email:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send email notification' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Email notification sent' });
    
  } catch (error) {
    console.error('Unexpected error in send-email API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the email request' },
      { status: 500 }
    );
  }
} 