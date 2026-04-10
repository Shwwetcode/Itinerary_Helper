import React, { useState } from 'react';
import {
  Plane, Calendar, MapPin, Navigation, DollarSign,
  Cloud, Users, Sparkles, KeyRound, Eye, EyeOff,
  AlertTriangle, Loader2, Fuel, Heart, Clock, CalendarDays
} from 'lucide-react';

const ANALYSIS_STEPS = [
  'Analyzing starting point & transport range…',
  'Checking traffic patterns for your departure…',
  'Matching destinations to weather & scenery…',
  'Optimizing stops for your budget…',
  'Calculating real-world routes & congestion…',
  'Composing your perfect itinerary…',
];

export default function LandingView({ onSubmit, isLoading, errorMessage }) {
  const [formData, setFormData] = useState({
    startingPoint: '',
    mood: 'Adventurous',
    weather: 'Sunny',
    socialVibe: 'Friends',
    scenery: 'Mountainous',
    duration: 3,
    transport: '',
    budget: '',
    currency: 'INR',
    vehicleMileage: '',
    departureTime: '08:00',
    departureDate: new Date().toISOString().split('T')[0],
    apiKey: '',
  });

  const [showKey, setShowKey] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle through loading step labels while generating
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Determine day label for departure date
  const getDayLabel = () => {
    if (!formData.departureDate) return '';
    const date = new Date(formData.departureDate + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Get traffic hint based on time
  const getTrafficHint = () => {
    if (!formData.departureTime) return null;
    const hour = parseInt(formData.departureTime.split(':')[0], 10);
    const dayLabel = getDayLabel();
    const isWeekend = dayLabel === 'Saturday' || dayLabel === 'Sunday';

    if (isWeekend) {
      return { level: 'low', text: 'Weekend traffic — roads are typically lighter ☀️' };
    }
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      return { level: 'heavy', text: 'Peak rush hour — expect congestion on major routes 🔴' };
    }
    if ((hour >= 11 && hour <= 16) || hour >= 21 || hour <= 5) {
      return { level: 'low', text: 'Off-peak hours — smooth sailing ahead 🟢' };
    }
    return { level: 'moderate', text: 'Moderate traffic expected — plan extra buffer time 🟡' };
  };

  const trafficHint = getTrafficHint();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fade-in flex flex-col items-center justify-center min-h-[90vh]">

      {/* ── Warm ambient glow ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-terracotta-300/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-glow-warm" />
      <div className="absolute top-60 right-0 w-[250px] h-[250px] bg-sandstone-300/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* ── Hero Header ── */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="inline-flex items-center justify-center p-3.5 bg-terracotta-50 rounded-2xl mb-5 border border-terracotta-200 shadow-[0_0_24px_rgba(212,145,90,0.15)]">
          <MapPin className="text-terracotta-500 w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-espresso-700 via-terracotta-600 to-terracotta-400">
          Itinerary Architect
        </h1>
        <p className="text-lg md:text-xl text-espresso-300 max-w-2xl mx-auto font-light leading-relaxed">
          Tell us your vibe, budget, and transport — our AI will craft a pinpoint,
          traffic-smart itinerary with Google Maps directions.
        </p>
      </div>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="w-full max-w-3xl flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 animate-fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed font-medium">{errorMessage}</p>
        </div>
      )}

      {/* ── Main Form ── */}
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 md:p-10 w-full animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      >

        {/* ── Section: Departure Timing ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center p-1.5 bg-terracotta-100 rounded-lg">
              <Clock className="w-4 h-4 text-terracotta-500" />
            </div>
            <h2 className="text-base font-semibold text-espresso-700">Departure Timing</h2>
            <div className="flex-1 h-px bg-sandstone-200 ml-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Departure Date */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-espresso-500">
                <CalendarDays className="w-4 h-4 mr-2 text-terracotta-400" />
                Departure Date
              </label>
              <input
                required
                type="date"
                name="departureDate"
                id="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="input-field"
              />
              {getDayLabel() && (
                <p className="text-xs text-espresso-300 font-medium">{getDayLabel()}</p>
              )}
            </div>

            {/* Departure Time */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-espresso-500">
                <Clock className="w-4 h-4 mr-2 text-terracotta-400" />
                Departure Time
              </label>
              <input
                required
                type="time"
                name="departureTime"
                id="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Live Traffic Hint */}
          {trafficHint && (
            <div className={`mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              trafficHint.level === 'low' ? 'bg-sage-50 border border-sage-200 text-sage-600' :
              trafficHint.level === 'moderate' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
              'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                trafficHint.level === 'low' ? 'bg-sage-400' :
                trafficHint.level === 'moderate' ? 'bg-yellow-400' :
                'bg-red-400'
              }`} />
              {trafficHint.text}
            </div>
          )}
        </div>

        {/* ── Section: Trip Details ── */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center p-1.5 bg-terracotta-100 rounded-lg">
            <Sparkles className="w-4 h-4 text-terracotta-500" />
          </div>
          <h2 className="text-base font-semibold text-espresso-700">Trip Details</h2>
          <div className="flex-1 h-px bg-sandstone-200 ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">

          {/* Starting Point */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Navigation className="w-4 h-4 mr-2 text-terracotta-400" />
              Starting Point
            </label>
            <input
              required
              type="text"
              name="startingPoint"
              id="startingPoint"
              value={formData.startingPoint}
              onChange={handleChange}
              placeholder="e.g. New Delhi, India"
              className="input-field"
            />
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Sparkles className="w-4 h-4 mr-2 text-terracotta-400" />
              Current Mood
            </label>
            <select name="mood" id="mood" value={formData.mood} onChange={handleChange} className="input-field appearance-none">
              <option value="Adventurous">🧗 Adventurous</option>
              <option value="Zen">🧘 Zen</option>
              <option value="Romantic">💑 Romantic</option>
              <option value="Party">🎉 Party</option>
              <option value="Healing">🌿 Healing</option>
            </select>
          </div>

          {/* Weather */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Cloud className="w-4 h-4 mr-2 text-terracotta-400" />
              Desired Weather
            </label>
            <select name="weather" id="weather" value={formData.weather} onChange={handleChange} className="input-field appearance-none">
              <option value="Sunny">☀️ Sunny &amp; Warm</option>
              <option value="Snowy">❄️ Snowy &amp; Cold</option>
              <option value="Cool">🌤 Cool &amp; Breezy</option>
              <option value="Tropical">🌴 Tropical &amp; Humid</option>
            </select>
          </div>

          {/* Social Vibe */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Users className="w-4 h-4 mr-2 text-terracotta-400" />
              Social Vibe
            </label>
            <select name="socialVibe" id="socialVibe" value={formData.socialVibe} onChange={handleChange} className="input-field appearance-none">
              <option value="Solo">🧍 Solo Explorer</option>
              <option value="Family">👨‍👩‍👧 Family</option>
              <option value="Friends">🤝 Friends Group</option>
              <option value="Couple">💍 Couple</option>
            </select>
          </div>

          {/* Scenery */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <MapPin className="w-4 h-4 mr-2 text-terracotta-400" />
              Scenery Preference
            </label>
            <select name="scenery" id="scenery" value={formData.scenery} onChange={handleChange} className="input-field appearance-none">
              <option value="Coastal">🌊 Coastal</option>
              <option value="Mountainous">⛰️ Mountainous</option>
              <option value="Urban">🏙️ Urban</option>
              <option value="Forest">🌲 Forest</option>
              <option value="Desert">🏜️ Desert</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Calendar className="w-4 h-4 mr-2 text-terracotta-400" />
              Trip Duration (Days)
            </label>
            <input
              required
              type="number"
              name="duration"
              id="duration"
              min="1"
              max="30"
              value={formData.duration}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Transport */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Plane className="w-4 h-4 mr-2 text-terracotta-400" />
              Mode of Transport
            </label>
            <input
              required
              type="text"
              name="transport"
              id="transport"
              value={formData.transport}
              onChange={handleChange}
              placeholder="e.g. Car, Train, Flight, Bicycle"
              className="input-field"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <DollarSign className="w-4 h-4 mr-2 text-terracotta-400" />
              Total Budget
            </label>
            <div className="flex gap-2">
              <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className="input-field appearance-none w-24 shrink-0">
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                required
                type="number"
                name="budget"
                id="budget"
                min="500"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className="input-field"
              />
            </div>
            <p className="text-xs text-espresso-300">Total trip budget including fuel, food, and stays.</p>
          </div>

          {/* Vehicle Mileage */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500">
              <Fuel className="w-4 h-4 mr-2 text-terracotta-400" />
              Vehicle Mileage (km/l)
            </label>
            <input
              type="number"
              name="vehicleMileage"
              id="vehicleMileage"
              min="1"
              max="100"
              value={formData.vehicleMileage}
              onChange={handleChange}
              placeholder="e.g. 35"
              className="input-field"
            />
            <p className="text-xs text-espresso-300">Helps estimate fuel costs and plan refueling stops.</p>
          </div>

        </div>

        {/* ── API Key Section ── */}
        <div className="mt-8 pt-6 border-t border-sandstone-200">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-espresso-500" htmlFor="apiKey">
              <KeyRound className="w-4 h-4 mr-2 text-terracotta-400" />
              Gemini API Key
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-terracotta-50 text-terracotta-600 border border-terracotta-200">
                Required
              </span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                name="apiKey"
                id="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="Paste your Gemini API key (or set VITE_GEMINI_API_KEY in .env)"
                className="input-field pr-12 font-mono text-sm"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-300 hover:text-espresso-600 transition-colors"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-espresso-300 mt-1">
              Get a free key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2 transition-colors"
              >
                Google AI Studio
              </a>
              . Your key is never stored or sent anywhere except the Gemini API.
            </p>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            id="generateBtn"
            className="btn-primary flex items-center justify-center py-4 text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="animate-pulse">{ANALYSIS_STEPS[loadingStep]}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate My Itinerary
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
