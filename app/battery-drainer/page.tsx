"use client";

import { useState, useEffect } from "react";
import { GPUTorture } from "@/components/battery/GPUTorture";
import { CPUMiner } from "@/components/battery/CPUMiner";
import { BatteryStatus } from "@/components/battery/BatteryStatus";
import { ArrowLeft, Zap, Info, Moon, Sun, Volume2, VolumeX, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";

export default function BatteryDrainer() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gpuEnabled, setGpuEnabled] = useState(false);
  const [gpuIntensity, setGpuIntensity] = useState(50);
  const [cpuEnabled, setCpuEnabled] = useState(false);
  const [cpuThreads, setCpuThreads] = useState(2);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [brightnessMax, setBrightnessMax] = useState(false);

  // Calculate estimated drain
  const estimatedDrain = 
    (gpuEnabled ? 0.5 + (gpuIntensity / 100) * 2 : 0) +
    (cpuEnabled ? cpuThreads * 0.5 : 0) +
    (vibrationEnabled ? 0.3 : 0) +
    (brightnessMax ? 0.5 : 0);

  // Vibration effect
  useEffect(() => {
    if (!vibrationEnabled) return;
    
    const vibrate = () => {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    };
    
    vibrate();
    const interval = setInterval(vibrate, 500);
    return () => clearInterval(interval);
  }, [vibrationEnabled]);

  // Brightness (CSS hack - not real brightness control)
  useEffect(() => {
    if (brightnessMax) {
      document.body.style.filter = "brightness(1.5)";
    } else {
      document.body.style.filter = "";
    }
    return () => {
      document.body.style.filter = "";
    };
  }, [brightnessMax]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const enableAll = () => {
    setGpuEnabled(true);
    setGpuIntensity(100);
    setCpuEnabled(true);
    setCpuThreads(navigator.hardwareConcurrency || 4);
    setVibrationEnabled(true);
    setBrightnessMax(true);
  };

  const disableAll = () => {
    setGpuEnabled(false);
    setCpuEnabled(false);
    setVibrationEnabled(false);
    setBrightnessMax(false);
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar - Controls */}
      <aside className="w-80 border-r border-border bg-card p-6 flex flex-col gap-4 z-20 shadow-xl overflow-y-auto">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Zap size={24} /> Battery Drainer
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={enableAll}
              className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm"
            >
              🔥 MAXIMUM
            </button>
            <button
              onClick={disableAll}
              className="flex-1 py-2 rounded-lg bg-secondary font-bold hover:bg-secondary/80 transition-colors text-sm"
            >
              ⏹️ Stop All
            </button>
          </div>

          {/* GPU Control */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Monitor size={16} /> GPU Torture
              </h3>
              <button
                onClick={() => setGpuEnabled(!gpuEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  gpuEnabled 
                    ? "bg-green-500 text-white" 
                    : "bg-secondary"
                }`}
              >
                {gpuEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Intensity</span>
                <span>{gpuIntensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={gpuIntensity}
                onChange={(e) => setGpuIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* CPU Control */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                ⛏️ CPU Miner
              </h3>
              <button
                onClick={() => setCpuEnabled(!cpuEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  cpuEnabled 
                    ? "bg-green-500 text-white" 
                    : "bg-secondary"
                }`}
              >
                {cpuEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Threads</span>
                <span>{cpuThreads} / {navigator.hardwareConcurrency || 4}</span>
              </div>
              <input
                type="range"
                min="1"
                max={navigator.hardwareConcurrency || 4}
                value={cpuThreads}
                onChange={(e) => setCpuThreads(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Vibration (Mobile) */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Smartphone size={16} /> Vibration
              </h3>
              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  vibrationEnabled 
                    ? "bg-green-500 text-white" 
                    : "bg-secondary"
                }`}
              >
                {vibrationEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mobile only. Constant haptic feedback.
            </p>
          </div>

          {/* Brightness */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                ☀️ Brightness Boost
              </h3>
              <button
                onClick={() => setBrightnessMax(!brightnessMax)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  brightnessMax 
                    ? "bg-green-500 text-white" 
                    : "bg-secondary"
                }`}
              >
                {brightnessMax ? "MAX" : "OFF"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              CSS brightness boost (simulated).
            </p>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-400">
              ⚠️ This will drain your battery faster. Use responsibly 
              (or irresponsibly, we're not the boss of you).
            </p>
          </div>
        </div>
      </aside>

      {/* Center - GPU Torture Display */}
      <main className="flex-1 relative bg-black">
        <GPUTorture enabled={gpuEnabled} intensity={gpuIntensity} />
        
        {!gpuEnabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚡</div>
              <h2 className="text-2xl font-bold">Battery Drainer</h2>
              <p className="text-muted-foreground max-w-md">
                Need your phone to die? Enable the GPU torture and CPU miner 
                for maximum power consumption.
              </p>
              <button
                onClick={enableAll}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                🔥 Start Draining
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Stats */}
      <aside className="w-72 border-l border-border bg-card p-6 flex flex-col gap-4 z-20 overflow-y-auto">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <BatteryStatus estimatedDrain={estimatedDrain} />
        
        <CPUMiner 
          enabled={cpuEnabled} 
          threads={cpuThreads}
        />

        {/* Tips */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <Info size={16} /> Pro Tips
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Max GPU + CPU = fastest drain</li>
            <li>Screen brightness helps too</li>
            <li>Unplug charger for best results</li>
            <li>The "earnings" are fake, sorry</li>
          </ul>
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.4.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
