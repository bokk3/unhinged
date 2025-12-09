"use client";

import { useState, useEffect } from "react";
import { FleeingButton } from "@/components/worst-ux/FleeingButton";
import { ModalHell } from "@/components/worst-ux/ModalHell";
import { ChaosForm } from "@/components/worst-ux/ChaosForm";
import { ChaosScroll } from "@/components/worst-ux/ChaosScroll";
import { FrustrationStats } from "@/components/worst-ux/FrustrationStats";
import { ArrowLeft, Settings, Skull, Info, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function WorstUiUx() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  const [frustrationCount, setFrustrationCount] = useState(0);
  const [scrollReversals, setScrollReversals] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Eye-bleeding mode
  const [eyeBleedingMode, setEyeBleedingMode] = useState(false);
  
  // Ghost clicks
  const [ghostClicksEnabled, setGhostClicksEnabled] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleFrustration = () => {
    setFrustrationCount(prev => prev + 1);
    if (audioEnabled) {
      // Play annoying sound (browser may block this)
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
        audio.volume = 0.1;
        audio.play().catch(() => {});
      } catch {}
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setModalCount(prev => prev + 1);
    handleFrustration();
  };

  const handleScrollReversal = () => {
    setScrollReversals(prev => prev + 1);
    handleFrustration();
  };

  // Random popup timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05 && !isModalOpen) { // 5% chance every 3 seconds
        handleModalOpen();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isModalOpen]);

  return (
    <div 
      className={`h-screen flex overflow-hidden transition-all duration-300 ${
        eyeBleedingMode 
          ? "bg-[#00ff00] text-[#ff0000]" 
          : "bg-background text-foreground"
      }`}
      style={{
        fontFamily: eyeBleedingMode ? "'Comic Sans MS', cursive" : "inherit",
      }}
    >
      {/* Left Sidebar - Chaos Settings */}
      <aside className={`w-80 border-r p-6 flex flex-col gap-6 z-20 shadow-xl ${
        eyeBleedingMode ? "bg-[#ff00ff] border-[#00ffff]" : "bg-card border-border"
      }`}>
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Skull size={24} /> Chaos Settings
          </h1>
        </div>

        <div className="flex-1 space-y-4 overflow-auto">
          {/* Chaos Toggles */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Settings size={16} /> Torture Options
            </h3>

            {/* Ghost Clicks Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Ghost Clicks (0-3s delay)</span>
              <input 
                type="checkbox"
                checked={ghostClicksEnabled}
                onChange={() => { setGhostClicksEnabled(!ghostClicksEnabled); handleFrustration(); }}
                className="w-5 h-5"
              />
            </label>

            {/* Eye Bleeding Mode */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Eye-Bleeding Mode™</span>
              <input 
                type="checkbox"
                checked={eyeBleedingMode}
                onChange={() => { setEyeBleedingMode(!eyeBleedingMode); handleFrustration(); }}
                className="w-5 h-5"
              />
            </label>

            {/* Audio Assault */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Audio Assault</span>
              <input 
                type="checkbox"
                checked={audioEnabled}
                onChange={() => setAudioEnabled(!audioEnabled)}
                className="w-5 h-5"
              />
            </label>
          </div>

          {/* Open Modal Button */}
          <button
            onClick={handleModalOpen}
            className="w-full py-3 rounded-lg bg-red-500/20 text-red-500 border border-red-500/50 font-bold hover:bg-red-500/30 transition-colors"
          >
            🪟 Spawn Modal Hydra
          </button>

          {/* Inverted Instructions */}
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            <h3 className="font-bold text-sm mb-1">Instructions</h3>
            <p className="text-xs opacity-90">
              To close this page, simply solve the form, catch the submit button, 
              close all modals, and scroll to the bottom. Easy!
            </p>
          </div>
        </div>
      </aside>

      {/* Center - The Torture Chamber */}
      <main className={`flex-1 relative overflow-hidden ${
        eyeBleedingMode ? "bg-[#ff0000]" : "bg-neutral-900/50"
      }`}>
        <ChaosScroll onScrollReversal={handleScrollReversal}>
          <div className="p-8 space-y-8 pb-[200vh]">
            {/* Header */}
            <div className="text-center space-y-2 pt-8">
              <h2 className="text-4xl font-black">Welcome to UX Hell</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every dark pattern. Every hostile design choice. All in one place.
              </p>
            </div>

            {/* The Chaos Form */}
            <div className="max-w-xl mx-auto p-6 bg-card rounded-2xl border border-border shadow-xl">
              <h3 className="text-xl font-bold mb-4">📝 Registration Form</h3>
              <ChaosForm onFrustration={handleFrustration} />
              
              {/* Fleeing Submit Button */}
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Try to click Submit:</label>
                <FleeingButton onClick={() => alert("HOW DID YOU DO THAT?!")}>
                  Submit Form
                </FleeingButton>
              </div>
            </div>

            {/* Fake Content to Scroll */}
            <div className="max-w-xl mx-auto space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className="p-4 bg-card/50 rounded-lg border border-border"
                >
                  <h4 className="font-bold">Section {i + 1}</h4>
                  <p className="text-sm text-muted-foreground">
                    Scroll down to find the actual content. Or don't. 
                    The scroll might reverse at any moment.
                  </p>
                </div>
              ))}
            </div>

            {/* Fake Footer */}
            <div className="text-center text-sm text-muted-foreground py-20">
              <p>You made it! Just kidding, there's more.</p>
            </div>
          </div>
        </ChaosScroll>
      </main>

      {/* Right Sidebar - Frustration Stats */}
      <aside className={`w-72 border-l p-6 flex flex-col gap-6 z-20 ${
        eyeBleedingMode ? "bg-[#00ffff] border-[#ff00ff]" : "bg-card border-border"
      }`}>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Info size={16} /> Frustration Tracker
          </h3>
          <FrustrationStats 
            frustrationCount={frustrationCount}
            modalCount={modalCount}
            scrollReversals={scrollReversals}
          />
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.2.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>

      {/* Modal Hell */}
      <ModalHell isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
