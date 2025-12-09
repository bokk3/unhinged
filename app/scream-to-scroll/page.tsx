"use client";

import { useState, useEffect } from "react";
import { useAudioInput } from "@/components/scream/useAudioInput";
import { VUMeter } from "@/components/scream/VUMeter";
import { Knob } from "@/components/scream/Knob";
import { ImageFeed } from "@/components/scream/ImageFeed";
import { Mic, MicOff, ArrowLeft, Info, Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function ScreamToScroll() {
  const { volume, isListening, startListening, stopListening } = useAudioInput();
  const [threshold, setThreshold] = useState(50);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Trigger scroll when volume hits threshold
  useEffect(() => {
    if (isListening && volume >= threshold && !shouldScroll) {
      setShouldScroll(true);
    }
  }, [volume, threshold, isListening, shouldScroll]);

  const handleScrollComplete = () => {
    setShouldScroll(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar - Controls */}
      <aside className="w-80 border-r border-border bg-card p-6 flex flex-col gap-8 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Scream Control</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12">
          {/* VU Meter Section */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Input Level</h2>
            <VUMeter volume={volume} threshold={threshold} />
          </div>

          {/* Sensitivity Knob */}
          <div className="flex flex-col items-center gap-4">
            <Knob 
              value={threshold} 
              onChange={setThreshold} 
              label="Scream Threshold" 
            />
            <p className="text-xs text-center text-muted-foreground max-w-[200px]">
              Adjust the knob to set how loud you need to scream to scroll.
            </p>
          </div>
        </div>

        {/* Mic Toggle */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isListening 
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-2 border-red-500/50" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          }`}
        >
          {isListening ? (
            <>
              <MicOff size={24} /> Stop Screaming
            </>
          ) : (
            <>
              <Mic size={24} /> Start Mic
            </>
          )}
        </button>
      </aside>

      {/* Center - Feed */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <ImageFeed shouldScroll={shouldScroll} onScrollComplete={handleScrollComplete} />
        
        {/* Overlay for "Scream Now" */}
        {!isListening && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center space-y-4 max-w-md p-6">
              <h2 className="text-3xl font-black">Ready to Scream?</h2>
              <p className="text-muted-foreground">
                Enable your microphone and make some noise to scroll through the feed. 
                Warning: May annoy neighbors.
              </p>
              <button
                onClick={startListening}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform"
              >
                Enable Microphone
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Info */}
      <aside className="w-64 border-l border-border bg-card p-6 flex flex-col gap-6 z-20">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Info size={16} /> How it works
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Allow microphone access</li>
              <li>Set the sensitivity threshold</li>
              <li>Scream, clap, or yell</li>
              <li>Watch the feed scroll</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            <h3 className="font-bold text-sm mb-1">Pro Tip</h3>
            <p className="text-xs opacity-90">
              Short, sharp noises work best for snapping to the next image. Continuous screaming might cause motion sickness.
            </p>
          </div>
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.1.3</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
