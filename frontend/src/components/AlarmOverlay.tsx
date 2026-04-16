import React, { useEffect, useState } from 'react';
import { AlarmClock, Play, SkipForward, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AlarmOverlay() {
  const [params] = useState(new URLSearchParams(window.location.search));
  const id = params.get('id') || '';
  const title = params.get('title') || 'Task Due';
  const body = params.get('body') || 'Your scheduled time has arrived.';
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Attempt to make full screen on load (for web browser fallback)
    document.documentElement.classList.add('dark'); // Force dark mode for overlay
  }, []);

  const stop = async () => {
    setClosing(true);
    // Call the native electron preload method to stop beeping and close the window
    if (window.edenNative?.stopAlarm) {
      await window.edenNative.stopAlarm(id);
    }
  };

  const postpone = async () => {
    // For simplicity, stopping the alarm dismisses the card.
    // Full snooze logic could be added to backend, but dismissing is standard.
    await stop();
  };

  const completeAndEnter = async () => {
    await stop();
    // In a full implementation, this could mark task as complete via an API request.
  };

  return (
    <div className={cn(
      "min-h-screen w-full bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white font-sans transition-all duration-700 ease-in-out",
      closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
    )}>
      
      {/* Premium Glassmorphic Card */}
      <div className="relative overflow-hidden w-full max-w-sm sm:max-w-md rounded-[2.5rem] bg-white/10 border border-white/20 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center isolate">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/20 blur-[80px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 blur-[60px] -z-10 rounded-full"></div>

        <div className="animate-bounce mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500/30 border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <AlarmClock className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
          {title}
        </h1>
        
        <p className="text-base sm:text-lg text-white/70 font-medium mb-10 max-w-sm leading-relaxed">
          {body}
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={completeAndEnter}
            className="group relative w-full h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <Play className="w-5 h-5" />
            <span className="relative z-10">Enter Eden</span>
          </button>

          <div className="flex gap-3 mt-1">
            <button
              onClick={postpone}
              className="flex-1 h-14 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <AlarmClock className="w-4 h-4" />
              Postpone
            </button>
            <button
              onClick={stop}
              className="flex-1 h-14 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
