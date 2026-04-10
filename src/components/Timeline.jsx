import React from 'react';
import { Calendar, CornerDownRight, AlertTriangle, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

// Traffic level config
const TRAFFIC_CONFIG = {
  low: {
    dot: 'bg-sage-400',
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    text: 'text-sage-700',
    label: 'Smooth',
    icon: '🟢',
  },
  moderate: {
    dot: 'bg-yellow-400',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    label: 'Moderate',
    icon: '🟡',
  },
  heavy: {
    dot: 'bg-red-400',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    label: 'Heavy',
    icon: '🔴',
  },
};

export default function Timeline({ itinerary }) {
  return (
    <div className="space-y-12">
      {itinerary.map((dayData, dayIndex) => (
        <div key={dayIndex} className="animate-slide-up" style={{ animationDelay: `${dayIndex * 0.15}s` }}>
          {/* Day Header */}
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center bg-terracotta-500 rounded-xl p-2.5 mr-4 shadow-lg shadow-terracotta-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-espresso-800 tracking-tight">Day {dayData.day}</h2>
            <div className="flex-1 ml-4 h-px bg-sandstone-200"></div>
          </div>

          {/* Stops Timeline */}
          <div className="relative pl-6 sm:pl-8 ml-4 sm:ml-5 border-l-2 border-sandstone-300/60 space-y-8">
            {dayData.stops.map((stop, stopIndex) => {
              // Handle both old string format and new object format for transit_to_next
              const transit = stop.transit_to_next;
              const isObject = transit && typeof transit === 'object';
              const transitSummary = isObject ? transit.summary : transit;
              const trafficLevel = isObject ? transit.traffic_level : null;
              const adjustedTime = isObject ? transit.adjusted_travel_time : null;
              const optimalWindow = isObject ? transit.optimal_departure_window : null;
              const trafficCfg = trafficLevel ? TRAFFIC_CONFIG[trafficLevel] || TRAFFIC_CONFIG.low : null;

              return (
                <div key={stopIndex} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute w-4 h-4 bg-cream-100 border-2 border-terracotta-400 rounded-full -left-[1.6rem] sm:-left-[2.1rem] top-1.5 group-hover:bg-terracotta-400 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(212,145,90,0.4)] transition-all duration-300"></div>
                  
                  <div className="glass-card rounded-xl p-5 sm:p-6 transition-all duration-200">
                    <h3 className="text-xl font-bold text-espresso-800 mb-2 flex items-center">
                      {stop.name}
                    </h3>
                    <p className="text-espresso-400 leading-relaxed max-w-2xl mb-4">
                      {stop.description}
                    </p>
                    
                    {/* Transit Badge — Enhanced with Traffic */}
                    {transitSummary && (
                      <div className="space-y-2.5 mt-3">
                        {/* Main transit line */}
                        <div className="inline-flex items-start sm:items-center px-4 py-2.5 bg-sandstone-50 rounded-lg border border-sandstone-200 text-sm text-espresso-500">
                          <CornerDownRight className="w-4 h-4 mr-2 text-terracotta-400 shrink-0 mt-0.5 sm:mt-0" />
                          <span className="font-medium">{transitSummary}</span>
                        </div>

                        {/* Traffic indicator row */}
                        {trafficCfg && (
                          <div className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg ${trafficCfg.bg} border ${trafficCfg.border} text-sm`}>
                            {/* Traffic level badge */}
                            <div className={`inline-flex items-center gap-1.5 font-semibold ${trafficCfg.text}`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${trafficCfg.dot}`} />
                              {trafficCfg.icon} {trafficCfg.label} Traffic
                            </div>

                            {/* Adjusted time */}
                            {adjustedTime && (
                              <div className={`inline-flex items-center gap-1 ${trafficCfg.text} opacity-80`}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{adjustedTime}</span>
                              </div>
                            )}

                            {/* Optimal window */}
                            {optimalWindow && (
                              <div className={`inline-flex items-center gap-1 ${trafficCfg.text} opacity-80 text-xs`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{optimalWindow}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
