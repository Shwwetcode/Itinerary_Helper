/**
 * Itinerary Architect — Real AI Analysis Engine
 * Powered by Google Gemini API
 * Enhanced with Traffic-Aware Route Intelligence
 */
export const generateRealItinerary = async (formData) => {
  const {
    startingPoint,
    mood,
    weather,
    socialVibe,
    scenery,
    duration,
    transport,
    budget,
    currency,
    vehicleMileage,
    departureTime,
    departureDate,
    apiKey: formApiKey,
  } = formData;

  // Priority: form-provided key → env variable
  const apiKey = formApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'No Gemini API key found. Please paste your key in the "Gemini API Key" field or set VITE_GEMINI_API_KEY in your .env file.'
    );
  }

  // Build mileage context
  const mileageInfo = vehicleMileage
    ? `The vehicle gets approximately ${vehicleMileage} km/l. Use this to calculate fuel costs for each leg. Factor fuel expenses into the total budget.`
    : `Estimate fuel/travel costs based on standard consumption for "${transport}".`;

  const currencySymbol = { INR: '\u20b9', USD: '$', EUR: '\u20ac', GBP: '\u00a3' }[currency] || currency;

  // Build departure timing context
  const departureHour = departureTime ? parseInt(departureTime.split(':')[0], 10) : null;
  const departureDateObj = departureDate ? new Date(departureDate + 'T00:00:00') : null;
  const dayOfWeek = departureDateObj ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][departureDateObj.getDay()] : 'unknown';
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

  const trafficContext = `
TRAFFIC & TIMING INTELLIGENCE:
- The traveler plans to depart at ${departureTime || 'not specified'} on a ${dayOfWeek} (${departureDate || 'date not specified'}).
- ${isWeekend ? 'This is a WEEKEND — expect lighter traffic on commuter routes but potentially heavier traffic on tourist/leisure routes and highways leading to popular destinations.' : 'This is a WEEKDAY — factor in morning rush hour (7-10 AM) and evening rush hour (5-8 PM) on urban roads and highways.'}
- ${departureHour !== null ? (
    (departureHour >= 7 && departureHour <= 10) ? 'DEPARTURE IS DURING MORNING RUSH HOUR. Warn the traveler about congestion leaving the city. Suggest they leave before 6:30 AM or after 10 AM if possible. Add 30-50% extra time to the first transit leg.' :
    (departureHour >= 17 && departureHour <= 20) ? 'DEPARTURE IS DURING EVENING RUSH HOUR. Heavy outbound city traffic expected. Suggest alternate side routes or waiting until after 8:30 PM. Add 30-50% extra time to the first transit leg.' :
    (departureHour >= 21 || departureHour <= 5) ? 'DEPARTURE IS DURING LATE NIGHT / EARLY MORNING. Roads will be very clear. However, warn about driver fatigue and suggest well-lit rest stops.' :
    'Departure is during off-peak hours. Traffic should be manageable.'
  ) : 'No specific departure time provided.'}

For EACH transit leg in the itinerary:
1. Estimate the "base_travel_time" (travel time without traffic).
2. Estimate the "adjusted_travel_time" accounting for likely traffic at the time the traveler would reach that leg.
3. Assign a "traffic_level": "low" (free-flowing), "moderate" (some slowdowns, 15-30% delay), or "heavy" (significant congestion, 30-60% delay).
4. Provide an "optimal_departure_window" — the best time range to depart that leg to minimize traffic (e.g., "Leave before 7 AM or after 10 AM").

Also provide a top-level "traffic_summary" — a 2-3 sentence overview of the overall traffic outlook for this trip, including the best and worst times to travel.`;

  // ─── Intelligent System Prompt ───────────────────────────────────────────────
  const systemPrompt = `You are a world-class travel architect, intelligent route planner, traffic-aware advisor, and wellness-aware trip advisor.

TASK: Generate a ${duration}-day travel itinerary starting from "${startingPoint}".

TRAVELER PROFILE:
- Mood / Theme: ${mood}
- Desired Weather: ${weather} (only recommend destinations that plausibly have this weather at this time of year)
- Group Type: ${socialVibe}
- Scenery Preference: ${scenery}
- Transportation: ${transport}
  CRITICAL: Only suggest stops reachable by this transport. For bikes/motorcycles stay within 200-400 km/day; bicycles 30-80 km/day; cars 300-600 km/day; flights can span continents.
- Total Trip Budget: ${currencySymbol}${budget} ${currency} (this is the TOTAL budget for the entire trip including fuel, food, accommodation, and activities. You MUST keep your recommendations within this amount.)

VEHICLE & FUEL ANALYSIS:
${mileageInfo}
- For each transit leg, estimate the approximate fuel cost based on distance and current average fuel prices.
- If the cumulative fuel + stay + food cost would exceed ${currencySymbol}${budget}, shorten the route or suggest cheaper alternatives.

${trafficContext}

TRAVELER HEALTH & SAFETY:
- Plan mandatory rest/break stops every 2-3 hours of continuous riding/driving.
- Mark break stops clearly with "[REST STOP]" in the description. Suggest tea stalls, scenic viewpoints, or petrol pumps where the traveler can stretch, hydrate, and rest.
- For bike/motorcycle trips: suggest helmet-off breaks, hydration points. For long drives: suggest driver-swap or nap spots.
- Avoid scheduling more than 6-8 hours of total travel time per day.
- If the group type is "Family", add extra comfort stops (restrooms, kid-friendly spots).

RULES:
1. All place names MUST be real, verifiable locations (cities, towns, national parks, landmarks).
2. Distances and travel times MUST be realistic for "${transport}".
3. Budget must be reflected in accommodation, food, and activity suggestions. Quote estimated costs per stop whenever possible (in ${currency}).
4. Each day should have 2-4 main stops + health break stops as needed.
5. The google_maps_url MUST be a valid Google Maps Directions URL with exact stop names URL-encoded and separated by "/".
   Format: https://www.google.com/maps/dir/Stop+One/Stop+Two/Stop+Three

OUTPUT FORMAT: Return ONLY a raw JSON object (no markdown fences, no explanation) matching this exact schema:
{
  "trip_title": "A creative, evocative title for the trip (max 8 words)",
  "vibe_check": "A compelling 2-sentence summary highlighting the route's unique appeal and how it matches the traveler's vibe.",
  "google_maps_url": "https://www.google.com/maps/dir/StartCity/Stop1/Stop2/...",
  "estimated_total_cost": "e.g. ${currencySymbol}8,500 (breakdown: fuel ${currencySymbol}3,200 + stays ${currencySymbol}3,000 + food ${currencySymbol}2,300)",
  "traffic_summary": "A 2-3 sentence overview of overall traffic conditions for this trip. Mention the best/worst segments, peak hours to avoid, and any weekend advantages.",
  "itinerary": [
    {
      "day": 1,
      "stops": [
        {
          "name": "Exact Real Place Name",
          "description": "Why this place was chosen, what to do here (2-3 vivid sentences). If this is a rest stop, start with [REST STOP]. Include estimated cost if applicable.",
          "transit_to_next": {
            "summary": "e.g., '~2.5 hr ride (180 km) via NH-44 . est. fuel ${currencySymbol}350'",
            "traffic_level": "low | moderate | heavy",
            "base_travel_time": "e.g. 2 hr 15 min",
            "adjusted_travel_time": "e.g. 3 hr (with morning rush traffic)",
            "optimal_departure_window": "e.g. Leave before 7 AM or after 10 AM to skip rush hour"
          }
        }
      ]
    }
  ]
}

IMPORTANT: For the LAST stop of the ENTIRE trip, set "transit_to_next" to null.
For stops where traffic data isn't relevant (e.g. very short walks), you may still include the object but set traffic_level to "low".`;

  const payload = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      temperature: 0.75,
      responseMimeType: 'application/json',
    },
  };

  // ─── Model Fallback Chain ─────────────────────────────────────────────────────
  // Ordered from newest/most-capable → oldest/most-permissive free tier.
  // The engine tries each model in sequence; on quota (429) or model-not-found
  // (404) errors it waits briefly then moves to the next one automatically.
  const models = [
    'gemini-2.5-flash',         // newest — high capability, generous quota
    'gemini-2.5-pro',           // most capable 2.5
    'gemini-2.0-flash',         // fast & stable
    'gemini-2.0-flash-lite',    // lightweight 2.0
    'gemini-1.5-flash',         // older but very generous free tier
    'gemini-1.5-flash-8b',      // smallest/fastest 1.5 — highest RPM
    'gemini-1.5-pro',           // 1.5 pro as last resort
  ];

  /**
   * Returns true if the HTTP status / error body indicates a quota or rate-limit
   * issue (i.e., worth retrying with a different model).
   */
  const isRetryable = (status) =>
    status === 429 || status === 404 || status === 503 || status === 500;

  /**
   * Extracts the retry-after seconds from response headers or body, capped at 5s
   * so UX doesn't stall too long between model attempts.
   */
  const getRetryDelay = (resp) => {
    const retryAfter = resp?.headers?.get('Retry-After');
    const secs = retryAfter ? Math.min(parseFloat(retryAfter), 5) : 1;
    return secs * 1000;
  };

  const fetchWithModel = async (modelName) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  let response = null;
  let lastError = null;
  let usedModel = null;

  for (const model of models) {
    try {
      console.log(`[AI Engine] Trying model: ${model}`);
      response = await fetchWithModel(model);

      if (response.ok) {
        usedModel = model;
        console.log(`[AI Engine] ✅ Success with model: ${model}`);
        break;
      }

      // Auth errors: wrong key — no point trying other models
      if (response.status === 401 || response.status === 403) {
        console.warn(`[AI Engine] 🔑 Auth error on ${model}. Stopping.`);
        break;
      }

      if (isRetryable(response.status)) {
        const delay = getRetryDelay(response);
        console.warn(`[AI Engine] ⚠️ ${model} returned ${response.status}. Retrying next model in ${delay}ms...`);
        lastError = `${model}: HTTP ${response.status} (quota/rate-limit)`;
        await new Promise((res) => setTimeout(res, delay));
        response = null; // clear so fallback continues
        continue;
      }

      // Any other non-retryable HTTP error — stop
      lastError = `${model}: HTTP ${response.status}`;
      break;

    } catch (networkErr) {
      lastError = `${model}: Network error — ${networkErr.message}`;
      console.error(`[AI Engine] 🌐 Network error on ${model}:`, networkErr.message);
      response = null;
    }
  }

  if (!response || !response.ok) {
    let message = lastError || 'All Gemini models are currently unavailable. Please try again in a moment.';
    if (response) {
      try {
        const errData = await response.json();
        message = errData?.error?.message || message;
      } catch (_) {}

      if (response.status === 401 || response.status === 403) {
        message = 'Invalid or expired API key. Please check your Gemini API key and try again.';
      }
    }
    throw new Error(message);
  }

  // ─── Parse Response ───────────────────────────────────────────────────────────
  const data = await response.json();

  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error(
      'The AI returned an empty response. Please try again.'
    );
  }

  // Strip markdown fences if the model ignores instructions
  const cleanJson = textContent
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleanJson);
  } catch (_) {
    console.error('Failed to parse AI JSON:', cleanJson);
    throw new Error(
      'The AI returned an unexpected format. Please try again — this is usually a one-time glitch.'
    );
  }
};
