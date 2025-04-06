import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the shape of the symptom data
export interface SymptomData {
  age: string;
  gender: string;
  symptoms: string;
  duration: string;
  severity: string;
  medicalHistory?: string;
  medications?: string;
}

// Define the shape of the analysis result
export interface SymptomAnalysisResult {
  possibleConditions: string[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  furtherTests: string[];
  disclaimer: string;
}

// Default disclaimer to include with all responses
const MEDICAL_DISCLAIMER = 
  "This is an AI-generated preliminary assessment only and is not a substitute for professional medical advice, " +
  "diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider " +
  "with any questions you may have regarding a medical condition.";

/**
 * Analyze symptoms using Gemini AI
 */
export async function analyzeSymptoms(data: SymptomData): Promise<SymptomAnalysisResult> {
  try {
    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    // Create a structured prompt for symptom analysis
    const prompt = `
      I need an analysis of the following health symptoms. Please provide a preliminary assessment only, 
      not a diagnosis, and emphasize the importance of consulting a healthcare professional.
      
      Patient details:
      - Age: ${data.age}
      - Gender: ${data.gender}
      - Symptoms: ${data.symptoms}
      - Duration: ${data.duration}
      - Severity: ${data.severity}
      ${data.medicalHistory ? `- Medical History: ${data.medicalHistory}` : ''}
      ${data.medications ? `- Current Medications: ${data.medications}` : ''}
      
      Please format your response in JSON with the following structure:
      {
        "possibleConditions": ["condition1", "condition2", ...],
        "riskLevel": "low" OR "medium" OR "high",
        "recommendations": ["recommendation1", "recommendation2", ...],
        "furtherTests": ["test1", "test2", ...]
      }
      
      Notes:
      - For the risk level, use "high" if immediate medical attention might be needed
      - For "medium" if they should see a doctor soon, and "low" if self-care may be appropriate
      - Keep explanations brief and focused
      - Do not include any disclaimers in the JSON, I will handle that separately
      - Format in valid JSON only, nothing else
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON from the response
    try {
      // Find JSON in the response (Gemini sometimes adds explanatory text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("Could not find JSON in the response");
      }
      
      const jsonStr = jsonMatch[0];
      const parsedResult = JSON.parse(jsonStr);
      
      // Return the parsed result with our disclaimer added
      return {
        ...parsedResult,
        disclaimer: MEDICAL_DISCLAIMER
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      
      // Return a fallback response if parsing fails
      return getFallbackResponse(data.symptoms);
    }
  } catch (error) {
    console.error("Error analyzing symptoms with Gemini:", error);
    
    // Return a fallback response if the API call fails
    return getFallbackResponse(data.symptoms);
  }
}

/**
 * Generate a fallback response if the API call fails
 */
function getFallbackResponse(symptoms: string): SymptomAnalysisResult {
  const symptomsLower = symptoms.toLowerCase();
  
  // Determine risk level based on keywords in the symptoms
  let riskLevel: "low" | "medium" | "high" = "low";
  let possibleConditions = ["Common cold", "Seasonal allergies", "Mild stress"];
  let recommendations = [
    "Rest and stay hydrated",
    "Over-the-counter medications may help relieve symptoms",
    "Monitor your symptoms for any changes"
  ];
  let furtherTests = ["No specific tests recommended at this time"];
  
  // Check for emergency symptoms
  if (
    symptomsLower.includes("chest pain") || 
    symptomsLower.includes("difficulty breathing") ||
    symptomsLower.includes("shortness of breath") ||
    symptomsLower.includes("severe headache") ||
    symptomsLower.includes("sudden") && (
      symptomsLower.includes("numbness") || 
      symptomsLower.includes("weakness") ||
      symptomsLower.includes("confusion") ||
      symptomsLower.includes("vision")
    )
  ) {
    riskLevel = "high";
    possibleConditions = ["Possible urgent medical condition requiring immediate evaluation"];
    recommendations = [
      "Seek immediate medical attention",
      "Call emergency services (911) if symptoms are severe",
      "Do not delay seeking care for these symptoms"
    ];
    furtherTests = ["Emergency medical evaluation"];
  } 
  // Check for concerning but not emergency symptoms
  else if (
    symptomsLower.includes("fever") ||
    symptomsLower.includes("persistent") ||
    symptomsLower.includes("worsening") ||
    symptomsLower.includes("severe pain") ||
    symptomsLower.includes("vomiting") ||
    symptomsLower.includes("diarrhea") && symptomsLower.includes("days")
  ) {
    riskLevel = "medium";
    possibleConditions = ["Infection", "Inflammatory condition", "Requires further evaluation"];
    recommendations = [
      "Schedule an appointment with a healthcare provider within 24-48 hours",
      "Rest and stay hydrated",
      "Take over-the-counter medications as directed for symptom relief"
    ];
    furtherTests = ["Medical evaluation", "Possible laboratory tests"];
  }
  
  return {
    possibleConditions,
    riskLevel,
    recommendations,
    furtherTests,
    disclaimer: MEDICAL_DISCLAIMER
  };
} 