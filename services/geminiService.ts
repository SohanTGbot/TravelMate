
import { GoogleGenAI, Type } from "@google/genai";
import { TripRequest, TripPlan } from "../types";

// Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("Gemini API Key is missing. Check .env.local and vite.config.ts");
}
const ai = new GoogleGenAI({ apiKey });

export const generateTripPlan = async (request: TripRequest): Promise<TripPlan> => {
  let destinationPrompt = request.destination;
  let surpriseContext = "";

  if (request.tripType === 'Multi-City' && request.stops && request.stops.length > 0) {
    destinationPrompt = `a multi-city trip covering: ${request.stops.join(', ')}`;
  } else if (request.destination === "Surprise Me") {
    destinationPrompt = "an appropriate destination based on the user's Vibe and Interests";
    surpriseContext = `
        SURPRISE ME LOGIC:
        - The user has NOT selected a specific destination. YOU MUST CHOOSE ONE.
        - User Vibe: ${request.vibe || 'General'}
        `;
  }

  const prompt = `
    Generate a HIGHLY DETAILED day-by-day travel itinerary for a trip to ${destinationPrompt}.
    ${request.origin ? `Starting From: ${request.origin}` : ''}
    
    TRIP PARAMETERS:
    - Trip Type: ${request.tripType || 'Single City'}
    - Duration: ${request.duration} days
    - Travel Month: ${request.travelMonth}
    - Group Type: ${request.groupType}
    - Budget Level: ${request.budget} ${request.budgetBreakdown ? `(Max Flights: ${request.budgetBreakdown.flights}, Max Hotels/Night: ${request.budgetBreakdown.hotels}, Max Daily: ${request.budgetBreakdown.daily})` : ''}
    - Key Interests: ${request.interests.join(', ')}
    - Activity Pace: ${request.activityLevel}
    - Dietary Preference: ${request.dietary}
    - Currency: ${request.currency}
    - Language: ${request.language}
    ${surpriseContext}
    
    CRITICAL INSTRUCTIONS:
    1. OUTPUT FORMAT: strict JSON.
    2. LANGUAGE: Keys in English, Values in ${request.language}.
    3. DATE SIMULATION: Simulate dates based on the month (e.g., "${request.travelMonth} 1", "${request.travelMonth} 2").
    4. DETAIL LEVEL: You must provide specific times, specific restaurant names, specific hotel names, and cost estimates per day.
    5. ANALYSIS: Calculate a 'Quality Score' (0-100) based on how good this destination is during the requested month (weather, crowds).
    6. ROUTING: If Multi-City or Road Trip, ensure the "Travel" object in each day clearly explains the movement between cities.
    
    ITINERARY STRUCTURE PER DAY:
    - Header: Day number, Date, City, Theme.
    - Travel (If moving between cities): Mode, Time, Arrival.
    - Accommodation: Name, Location, Check-in/out.
    - Activities: TIME-ORDERED list (Morning to Night). Include "Rest" or "Travel" as activities if applicable.
    - Meals: Specific Breakfast, Lunch, Dinner spots.
    - Costs: Breakdown of costs for that specific day in ${request.currency}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert travel planner AI. You provide concrete, logistical travel details, not just vague suggestions. You always response in valid JSON.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripName: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalBudgetEstimation: { type: Type.STRING },
            currency: { type: Type.STRING },
            hotels: { type: Type.ARRAY, items: { type: Type.STRING } },
            transportation: { type: Type.STRING },

            // New Fields
            suitabilityTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., 'Family Friendly', 'Romantic', 'Adventure', 'Budget Safe'" },
            qualityScore: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                text: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["score", "text", "reason"]
            },

            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  date: { type: Type.STRING },
                  city: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Day Theme" },
                  travel: {
                    type: Type.OBJECT,
                    properties: {
                      from: { type: Type.STRING },
                      to: { type: Type.STRING },
                      mode: { type: Type.STRING, enum: ['Bus', 'Train', 'Flight', 'Taxi', 'Ferry', 'Walk'] },
                      duration: { type: Type.STRING },
                      arrival: { type: Type.STRING }
                    },
                    nullable: true
                  },
                  accommodation: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      location: { type: Type.STRING },
                      checkIn: { type: Type.STRING },
                      checkOut: { type: Type.STRING },
                      nights: { type: Type.INTEGER }
                    },
                    nullable: true
                  },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Visit', 'Food', 'Shopping', 'Rest', 'Travel'] }
                      },
                      required: ["time", "activity", "description", "type"]
                    }
                  },
                  meals: {
                    type: Type.OBJECT,
                    properties: {
                      breakfast: { type: Type.STRING },
                      lunch: { type: Type.STRING },
                      dinner: { type: Type.STRING }
                    },
                    required: ["breakfast", "lunch", "dinner"]
                  },
                  costEstimate: {
                    type: Type.OBJECT,
                    properties: {
                      hotel: { type: Type.STRING },
                      travel: { type: Type.STRING },
                      activities: { type: Type.STRING },
                      food: { type: Type.STRING },
                      total: { type: Type.STRING }
                    },
                    required: ["total"]
                  }
                },
                required: ["day", "title", "activities", "date", "city", "meals", "costEstimate"]
              }
            },
            packingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            crowdLevel: { type: Type.STRING },
            weather: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.STRING },
                advice: { type: Type.STRING }
              },
              required: ["temperature", "advice"]
            },
            food: {
              type: Type.OBJECT,
              properties: {
                dailyBudget: { type: Type.STRING },
                mustTryDishes: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["dailyBudget", "mustTryDishes"]
            },
            localEtiquette: {
              type: Type.OBJECT,
              properties: {
                dos: { type: Type.ARRAY, items: { type: Type.STRING } },
                donts: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["dos", "donts"]
            },
            costSavingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencyInfo: {
              type: Type.OBJECT,
              properties: {
                police: { type: Type.STRING },
                ambulance: { type: Type.STRING },
                embassyHelp: { type: Type.STRING }
              },
              required: ["police", "ambulance"]
            }
          },
          required: [
            "tripName",
            "summary",
            "totalBudgetEstimation",
            "currency",
            "hotels",
            "transportation",
            "itinerary",
            "packingTips",
            "crowdLevel",
            "weather",
            "food",
            "localEtiquette",
            "costSavingTips",
            "emergencyInfo",
            "qualityScore",
            "suitabilityTags"
          ]
        }
      }
    });

    let text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    text = text.replace(/```json\n?|\n?```/g, '').trim();

    return JSON.parse(text) as TripPlan;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to generate trip plan: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Interface for the Chat Response
export interface TripAssistantResponse {
  modifiedPlan?: TripPlan;
  assistantReply: string;
}

export const chatWithTripAssistant = async (currentPlan: any, userInstruction: string): Promise<TripAssistantResponse> => {
  try {
    const prompt = `
    You are an expert travel assistant 'TravelMate AI'.
    I have an existing trip plan (JSON).
    
    CURRENT PLAN:
    ${JSON.stringify(currentPlan)}

    USER MESSAGE:
    "${userInstruction}"

    YOUR TASK:
    Determine if the user is asking to MODIFY the plan or just asking for INFORMATION.

    RESPONSE FORMAT (Strict JSON):
    {
      "modifiedPlan": (Optional) Return the FULL updated JSON plan if the user requested a change. Keep structure identical.
      "assistantReply": "Your text response here. Explain what you changed, or answer the user's question."
    }
    
    EXAMPLES:
    1. User: "Swap the museum for a hike."
       Response: { "modifiedPlan": {...}, "assistantReply": "I've replaced the museum with a scenic hike for you." }
    
    2. User: "What is the weather like?"
       Response: { "assistantReply": "In [Month], [City] is generally [Weather Details]..." } (No modifiedPlan needed)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    text = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text) as TripAssistantResponse;

  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    throw new Error("Failed to process request.");
  }
};