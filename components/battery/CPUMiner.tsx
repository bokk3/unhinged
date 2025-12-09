"use client";

import { useEffect, useState, useRef } from "react";

interface CPUMinerProps {
  enabled: boolean;
  threads: number;
}

export const CPUMiner = ({ enabled, threads }: CPUMinerProps) => {
  const [hashRate, setHashRate] = useState(0);
  const [totalHashes, setTotalHashes] = useState(0);
  const workersRef = useRef<Worker[]>([]);

  useEffect(() => {
    if (!enabled) {
      // Clean up workers
      workersRef.current.forEach(w => w.terminate());
      workersRef.current = [];
      return;
    }

    // Create fake mining workers using inline worker code
    const workerCode = `
      let hashes = 0;
      let lastReport = Date.now();
      
      const mine = () => {
        // Fake intensive calculation
        for (let i = 0; i < 10000; i++) {
          // Calculate SHA-256-like operations (fake but expensive)
          let hash = 0;
          for (let j = 0; j < 1000; j++) {
            hash = (hash * 31 + Math.sin(i * j) * 1000000) | 0;
          }
          hashes++;
        }
        
        const now = Date.now();
        if (now - lastReport > 1000) {
          const rate = hashes;
          hashes = 0;
          lastReport = now;
          self.postMessage({ hashRate: rate });
        }
        
        setTimeout(mine, 0);
      };
      
      mine();
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);

    const rates: number[] = new Array(threads).fill(0);

    // Create workers
    for (let i = 0; i < threads; i++) {
      const worker = new Worker(url);
      worker.onmessage = (e) => {
        rates[i] = e.data.hashRate;
        const combinedHashRate = rates.reduce((a, b) => a + b, 0);
        setHashRate(combinedHashRate);
        setTotalHashes(prev => prev + e.data.hashRate);
      };
      workersRef.current.push(worker);
    }

    return () => {
      URL.revokeObjectURL(url);
      workersRef.current.forEach(w => w.terminate());
      workersRef.current = [];
    };
  }, [enabled, threads]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-2">
          ⛏️ FakeCoin Miner™
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {enabled ? "MINING" : "IDLE"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Hash Rate</span>
          <span className="font-mono text-orange-400">{formatNumber(hashRate)}/s</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Total Hashes</span>
          <span className="font-mono">{formatNumber(totalHashes)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Threads</span>
          <span className="font-mono">{threads}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Earnings</span>
          <span className="font-mono text-yellow-400">$0.00 (it's fake)</span>
        </div>
      </div>

      {enabled && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: threads }).map((_, i) => (
            <div 
              key={i}
              className="flex-1 h-2 rounded-full bg-orange-500 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
