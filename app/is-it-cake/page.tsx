"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/cake/ImageUploader";
import { ScanningAnimation } from "@/components/cake/ScanningAnimation";
import { CakeResult } from "@/components/cake/CakeResult";
import { ArrowLeft, Cake, Info, Moon, Sun, Trophy } from "lucide-react";
import Link from "next/link";

type GameState = "upload" | "scanning" | "result";

interface Stats {
  totalScans: number;
  cakesFound: number;
  notCakes: number;
}

export default function IsItCake() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gameState, setGameState] = useState<GameState>("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCake, setIsCake] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalScans: 0, cakesFound: 0, notCakes: 0 });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    setGameState("scanning");
  };

  const handleScanComplete = (result: boolean) => {
    setIsCake(result);
    setStats(prev => ({
      totalScans: prev.totalScans + 1,
      cakesFound: prev.cakesFound + (result ? 1 : 0),
      notCakes: prev.notCakes + (result ? 0 : 1),
    }));
    setGameState("result");
  };

  const handleReset = () => {
    setGameState("upload");
    setImageUrl(null);
  };

  const getCakeHunterRank = () => {
    if (stats.totalScans === 0) return "Novice";
    if (stats.cakesFound >= 10) return "Cake Master";
    if (stats.cakesFound >= 5) return "Cake Hunter";
    if (stats.cakesFound >= 2) return "Cake Spotter";
    return "Cake Curious";
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Cake size={24} /> Is It Cake?
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Instructions */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> How It Works
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Upload any image</li>
              <li>Our "AI" scans for cake</li>
              <li>Discover if it's cake</li>
              <li>Everything could be cake</li>
            </ul>
          </div>

          {/* Stats */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-yellow-500" /> Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-secondary/30 text-center">
                <div className="text-xl font-bold text-pink-500">{stats.cakesFound}</div>
                <div className="text-xs text-muted-foreground">Cakes Found</div>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30 text-center">
                <div className="text-xl font-bold text-gray-500">{stats.notCakes}</div>
                <div className="text-xs text-muted-foreground">Not Cakes</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-muted-foreground">Rank: </span>
              <span className="text-sm font-bold text-primary">{getCakeHunterRank()}</span>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <h3 className="font-bold text-sm text-yellow-500 mb-2">🍰 Cake Fact</h3>
            <p className="text-xs text-muted-foreground">
              {[
                "Hyper-realistic cakes can fool even experts.",
                "Some cakes are so realistic, they've been mistaken for pets.",
                "Your couch? Probably cake.",
                "The average person unknowingly eats 3 cakes they thought were furniture per year.",
                "Scientists estimate 12% of all objects are secretly cake.",
              ][Math.floor(Math.random() * 5)]}
            </p>
          </div>
        </div>
      </aside>

      {/* Center - Main Game Area */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 p-8 max-w-2xl mx-auto min-h-full flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black mb-2">
              {gameState === "upload" && "🎂 Is It Cake?"}
              {gameState === "scanning" && "🔍 Analyzing..."}
              {gameState === "result" && (isCake ? "🍰 IT'S CAKE!" : "📦 NOT CAKE")}
            </h2>
            <p className="text-muted-foreground">
              {gameState === "upload" && "Upload an image to discover its true cake nature"}
              {gameState === "scanning" && "Our highly sophisticated AI is at work"}
              {gameState === "result" && "The verdict is in"}
            </p>
          </div>

          {/* Game Content */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
            {gameState === "upload" && (
              <ImageUploader onImageSelect={handleImageSelect} />
            )}

            {gameState === "scanning" && imageUrl && (
              <ScanningAnimation 
                imageUrl={imageUrl} 
                onComplete={handleScanComplete} 
              />
            )}

            {gameState === "result" && imageUrl && (
              <CakeResult 
                imageUrl={imageUrl} 
                isCake={isCake}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-muted-foreground mt-6 opacity-50">
            * This "AI" is completely random and just for fun. 
            Please don't actually try to eat your pets or furniture.
          </p>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 border-l border-border bg-card p-6 flex flex-col gap-6 z-20">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Recent Scans */}
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-3">Recent Discoveries</h3>
          {stats.totalScans === 0 ? (
            <p className="text-xs text-muted-foreground">
              No scans yet. Upload an image to find cake!
            </p>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <div className="text-3xl mb-1">
                  {stats.cakesFound > stats.notCakes ? "🎂" : "📦"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.cakesFound > stats.notCakes 
                    ? "You live in a world of cake!"
                    : "Your reality is... real. Boring."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <h3 className="font-bold text-sm mb-2">🏆 Top Cake Hunters</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>1. CakeLord99</span>
              <span className="text-primary">847 🍰</span>
            </div>
            <div className="flex justify-between">
              <span>2. FondantFinder</span>
              <span className="text-primary">623 🍰</span>
            </div>
            <div className="flex justify-between">
              <span>3. BatterHunter</span>
              <span className="text-primary">519 🍰</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>...You</span>
              <span>{stats.cakesFound} 🍰</span>
            </div>
          </div>
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.3.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
