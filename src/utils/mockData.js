export const generateRealItinerary = async (formData) => {
  const { startingPoint, mood, weather, socialVibe, scenery, duration, transport, budget } = formData;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) throw new Error("API Key is missing or not configured in .env file.");

  // Construct the powerful prompt
  const systemPrompt = `You are a world-class travel architect and intelligent router.
I need a ${duration}-day itinerary starting from "${startingPoint}".
- Mood: ${mood}
- Weather Expectation: ${weather}
- Social Context: ${socialVibe}
- Preferred Scenery: ${scenery}
- Transportation: ${transport}
- Budget: ${budget}

Your job is to deeply analyze the starting point and select REAL cities, towns, or famous landmarks that fit the scenery, weather, and budget within a REASONABLE distance capable of being reached by "${transport}" in the specified days.
You MUST output raw JSON (without markdown block formatting, just the raw JSON object) strictly matching this interface:
{
  "trip_title": "A catchy premium title",
  "vibe_check": "A 1-2 sentence compelling summary of the route and why it fits.",
  "google_maps_url": "A real literal Google Maps Directions URL containing the exact stops in order. (e.g., https://www.google.com/maps/dir/StartCity/Stop+1/Stop+2/)",
  "itinerary": [
    {
      "day": 1,
      "stops": [
        {
          "name": "REAL PLACE NAME",
          "description": "Why you chose it and what to do, factoring in money and weather.",
          "transit_to_next": "Real estimated distance/time to the next stop using the specified transport (or null if it's the last stop of the trip)"
        }
      ]
    }
  ]
}

DO NOT wrap the response in \`\`\`json blocks. Return exclusively the JSON object. Validate that your Google Maps URL is a valid format.`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  const fetchWithModel = async (modelName) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  };

  // Try models in order of preference, falling back on errors
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
  let response = null;

  for (const model of models) {
    response = await fetchWithModel(model);
    if (response.ok) break;
    // Only retry on server errors (503 overload, 404 not found, etc.)
    if (response.status >= 500 || response.status === 404) continue;
    break; // For client errors (401 bad key, etc.) don't retry
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.candidates[0].content.parts[0].text;
  
  // Clean up potential markdown formatting just in case
  const cleanJsonText = textContent.replace(/```json\n?|\n?```/gi, '').trim();
  
  try {
    return JSON.parse(cleanJsonText);
  } catch (err) {
    throw new Error("Failed to parse the AI's response. Please try again.");
  }
};
