// app/api/gemini/route.ts
export async function POST(req: Request) {
    try {
      console.log("Incoming request headers:", req.headers);
      const body = await req.json();
      console.log("Request body:", JSON.stringify(body, null, 2));
  
      // ... rest of your code ...
  
      const result = await model.generateContent(message);
      console.log("Gemini raw response:", JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error("Full error details:", {
        error: error instanceof Error ? error.stack : error,
        timestamp: new Date().toISOString()
      });
      // ... rest of error handling ...
    }
  }