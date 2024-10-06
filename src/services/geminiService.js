import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getGeminiResponse(prompt, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `You are an AI assistant for a founder networking platform. 
  You have access to the following context:
  - Current user: ${JSON.stringify(context.currentFounder)}
  - All founders: ${JSON.stringify(context.allFounders)}
  - Conversation history: ${JSON.stringify(context.previousMessages)}

  Please follow these guidelines:
  1. For nearby founders: Calculate distances based on latitude and longitude. Return founders within 50km.
  2. For recommended founders: Match based on skills, experience, and goals. Return top 5 matches.
  3. For general startup advice: Provide concise, practical advice based on the specific question.
  4. Always format your response as a JSON object with 'message' and 'founders' fields.
  5. The 'founders' field should be an array of founder objects or null if not applicable.

  Example response format:
  {
    "message": "Here are the nearby founders...",
    "founders": [{"id": "123", "name": "John Doe", "skills": "AI, ML", "distance": 10.5}, ...]
  }

  For general advice, use:
  {
    "message": "To build a startup...",
    "founders": null
  }`;

  try {
    const result = await model.generateContent(systemPrompt + "\n\nUser query: " + prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      message: "I'm sorry, I encountered an error while processing your request.",
      founders: null
    };
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula implementation
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}