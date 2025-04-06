import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from '@google/generative-ai';

// Define ChatMessage type for use in the chat application
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
    size?: string;
  }>;
}

// Generate a unique ID for chat messages
export const generateMessageId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// Initialize the Gemini API with your API key
const getGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Configure safety settings for the model
const safetySettings = [
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
];

// File to base64 helper function
export const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract the base64 data from the FileReader result
      const base64EncodedData = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64EncodedData.split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
  
  const base64EncodedData = await base64EncodedDataPromise;
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

// Convert text to part for consistency
const textToPart = (text: string): Part => {
  return { text };
};

// Send a message to Gemini and get a response
export const sendMessageToGemini = async (
  message: string, 
  history: any[] = [], 
  attachedFile?: File
) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // System instruction to focus only on health/medical topics
    const SYSTEM_INSTRUCTION = `
      You are a specialized AI Health Assistant. Your role is strictly limited to providing 
      information and advice related to health, medicine, fitness, nutrition, and well-being.

      Rules you must follow:
      1. Only respond to health/medical related questions
      2. If asked about non-health topics, politely decline and remind the user of your scope
      3. Always clarify that you provide general information, not medical advice
      4. For serious health concerns, recommend consulting a healthcare professional
      5. Never diagnose conditions or recommend specific treatments
      6. [ADD YOUR CUSTOM INSTRUCTIONS HERE]

      Your responses should be:
      - Accurate and evidence-based
      - Clear and easy to understand
      - Compassionate and supportive
      - Focused on prevention and general wellness
      - [ADD YOUR CUSTOM RESPONSE STYLE HERE]
    `;

    // Format conversation history for the model
    const formattedHistory = history
      .filter((msg, index, array) => {
        // Keep all messages after the first user message
        if (index > 0 && array.slice(0, index).some(m => m.role === 'user')) {
          return true;
        }
        // Only keep user messages before the first user message
        return msg.role === 'user';
      });

    // Create content parts that alternate between user and model
    const parts: { role: string; parts: Part[] }[] = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist with health and medical questions only.' }]
      }
    ];
    
    // Add conversation history
    formattedHistory.forEach(msg => {
      parts.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    // Add the current message and attachment if provided
    const currentMessageParts: Part[] = [];

    // Add text message
    if (message.trim()) {
      currentMessageParts.push(textToPart(message));
    }

    // Add file if provided
    if (attachedFile) {
      const filePart = await fileToGenerativePart(attachedFile);
      currentMessageParts.push(filePart);
      
      // Add context about the file
      if (attachedFile.type.startsWith('image/')) {
        currentMessageParts.push(textToPart(
          `I've attached this medical image. Please analyze it for health-related information only.`
        ));
      } else if (attachedFile.type === 'application/pdf') {
        currentMessageParts.push(textToPart(
          `I've attached this medical document. Please extract and analyze the relevant health information.`
        ));
      } else {
        currentMessageParts.push(textToPart(
          `I've attached a file (${attachedFile.name}). Please analyze its health-related content.`
        ));
      }
    }

    // If there are parts to add, add the user message
    if (currentMessageParts.length > 0) {
      parts.push({
        role: 'user',
        parts: currentMessageParts
      });
    }
    
    // Generate content
    const result = await model.generateContent({
      contents: parts,
      generationConfig: {
        temperature: 0.5, // Lower temperature for more focused responses; increase for more creativity (0.0-1.0)
        topK: 30, // Adjust between 1-40 to control diversity
        topP: 0.9, // Adjust between 0.0-1.0 to control randomness
        maxOutputTokens: 1024, // Increase for longer responses
      },
      safetySettings,
    });
    
    // Get the response text
    const response = result.response;
    let responseText = response.text();

    // Add a standard disclaimer to every response
    if (!responseText.includes("Disclaimer:")) {
      responseText += "\n\nDisclaimer: This information is for general knowledge only and not a substitute for professional medical advice. Always consult a healthcare provider for personal health concerns.";
    }

    return responseText;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
};