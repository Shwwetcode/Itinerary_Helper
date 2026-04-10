import React from 'react';
import Timeline from './Timeline';
import { Map, RefreshCw, Sparkles, ExternalLink, Wallet, TrafficCone, AlertTriangle, Clock } from 'lucide-react';

export default function ItineraryResultView({ data, onStartOver }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fade-in relative">

      {/* Background glow — warm amber */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-terracotta-300/10 blur-[140px] rounded-full pointer-events-none -z-10 animate-glow-warm" />
      <div className="absolute top-48 right-0 w-[300px] h-[300px] bg-sandstone-300/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ── Hero Header ── */}
      <div className="text-center mb-14 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 text-terracotta-600 text-sm font-medium mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Generated Itinerary
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-espresso-800 leading-tight">
          {data.trip_title}
        </h1>
        <p className="text-xl md:text-2xl text-espresso-400 max-w-3xl mx-auto font-light leading-relaxed">
          {data.vibe_check}
        </p>

        {/* Estimated Cost Badge */}
        {data.estimated_total_cost && (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-50 border border-sage-200 text-sage-700 text-sm font-medium animate-fade-in">
            <Wallet className="w-4 h-4" />
            <span>Estimated Cost: {data.estimated_total_cost}</span>
          </div>
        )}
      </div>

      {/* ── Traffic Summary Card ── */}
      {data.traffic_summary && (
        <div className="max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center p-2.5 bg-terracotta-100 rounded-xl shrink-0">
                <TrafficCone className="w-5 h-5 text-terracotta-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-espresso-800 mb-2 flex items-center gap-2">
                  Traffic Intelligence
                  <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta-50 text-terracotta-500 border border-terracotta-200 font-medium">
                    AI Analysis
                  </span>
                </h3>
                <p className="text-espresso-400 leading-relaxed text-sm sm:text-base">
                  {data.traffic_summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Google Maps CTA ── */}
      {data.google_maps_url && (
        <div className="flex justify-center mb-14 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <a
            href={data.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            id="openMapsBtn"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-xl group hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #D4915A 0%, #C06B3E 50%, #A95A33 100%)',
              boxShadow: '0 0 30px rgba(212,145,90,0.2), 0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Map className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-lg">Open Full Route in Google Maps</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      )}

      {/* ── Timeline ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <Timeline itinerary={data.itinerary} />
      </div>

      {/* ── Start Over ── */}
      <div className="flex justify-center mt-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <button
          onClick={onStartOver}
          id="startOverBtn"
          className="inline-flex items-center gap-2 px-7 py-3 bg-transparent hover:bg-sandstone-100 text-espresso-400 hover:text-espresso-700 rounded-xl transition-all duration-200 border border-transparent hover:border-sandstone-300 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Plan Another Trip
        </button>
      </div>
    </div>
  );
}
