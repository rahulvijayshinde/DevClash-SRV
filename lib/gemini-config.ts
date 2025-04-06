import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Gemini model configuration
export const GEMINI_CONFIG = {
  // Model selection - available options: "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"
  modelName: "gemini-1.5-pro",
  
  // System prompt - customize this to guide model behavior
  systemPrompt: `
    You are a specialized AI Health Assistant. Your role is strictly limited to providing 
    information and advice related to health, medicine, fitness, nutrition, and well-being.

    Rules you must follow:
    1. Only respond to health/medical related questions
    2. If asked about non-health topics, politely decline and remind the user of your scope
    3. Always clarify that you provide general information, not medical advice
    4. For serious health concerns, recommend consulting a healthcare professional
    5. Never diagnose conditions or recommend specific treatments

    Your responses should be:
    - Accurate and evidence-based
    - Clear and easy to understand
    - Compassionate and supportive
    - Focused on prevention and general wellness
  `,
  
  // Generation parameters
  generationConfig: {
    temperature: 0.5,   // 0.0 to 1.0 - Lower for more focused responses, higher for more creative
    topK: 30,           // 1 to 40 - Adjust to control diversity of responses
    topP: 0.9,          // 0.0 to 1.0 - Adjust to control randomness
    maxOutputTokens: 1024, // Maximum output length
  },
  
  // Safety settings
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],

  // Response customization
  responseCustomization: {
    addDisclaimer: true,
    disclaimerText: "Disclaimer: This information is for general knowledge only and not a substitute for professional medical advice. Always consult a healthcare provider for personal health concerns.",
  }
}; 