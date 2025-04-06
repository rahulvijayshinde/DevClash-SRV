# DevClash-SRV
# MedConnect - AI-Powered Healthcare Platform

A modern healthcare platform that connects patients with doctors and provides AI-powered health assessment tools.

## Features

- **AI Symptom Checker**: Get preliminary assessments based on your symptoms
- **Patient Dashboard**: Manage your health records and appointments
- **Doctor Consultations**: Connect with healthcare professionals
- **Medication Management**: Track your medications and prescriptions
- **Resources**: Access health information and educational materials
- **Secure Authentication**: Protected patient and doctor information

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn/UI
- **AI Integration**: Google's Gemini AI for symptom analysis
- **Database**: Supabase
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/medconnect.git
   cd medconnect
   ```

2. Install dependencies
   ```
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server
   ```
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and API clients
- `/hooks` - Custom React hooks
- `/styles` - Global styles and Tailwind configuration
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Key Features

### Symptom Checker

The AI-powered symptom checker uses Google's Gemini AI to analyze reported symptoms and provide preliminary assessments. It includes:

- Comprehensive symptom selection
- Pain level assessment
- Duration tracking
- PDF report generation

### Doctor Consultations

Patients can schedule virtual or in-person consultations with healthcare providers.

### Medication Management

Track prescribed medications, dosages, and schedules.

## Disclaimer

This application does not provide medical diagnosis. All assessments are preliminary and users should consult healthcare professionals for proper medical advice.

## Video Demo Link

https://drive.google.com/file/d/1uGeIRI63PqQ4Xe4gIcyfNJMeBnMo5kNV/view?usp=sharing
