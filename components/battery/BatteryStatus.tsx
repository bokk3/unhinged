"use client";

import { useEffect, useState } from "react";
import { Battery, BatteryCharging, BatteryLow, BatteryMedium, BatteryFull, Zap } from "lucide-react";

interface BatteryStatusProps {
  estimatedDrain: number; // % per minute
}

export const BatteryStatus = ({ estimatedDrain }: BatteryStatusProps) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [timeToEmpty, setTimeToEmpty] = useState<number | null>(null);

  useEffect(() => {
    const getBattery = async () => {
      try {
        // @ts-ignore - Battery API
        const battery = await navigator.getBattery?.();
        if (battery) {
          const update = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
            if (battery.dischargingTime !== Infinity) {
              setTimeToEmpty(Math.round(battery.dischargingTime / 60));
            }
          };
          update();
          battery.addEventListener("levelchange", update);
          battery.addEventListener("chargingchange", update);
          return () => {
            battery.removeEventListener("levelchange", update);
            battery.removeEventListener("chargingchange", update);
          };
        }
      } catch {
        // Battery API not available
      }
    };
    getBattery();
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging size={24} className="text-green-400" />;
    if (batteryLevel === null) return <Battery size={24} />;
    if (batteryLevel < 20) return <BatteryLow size={24} className="text-red-400" />;
    if (batteryLevel < 50) return <BatteryMedium size={24} className="text-yellow-400" />;
    return <BatteryFull size={24} className="text-green-400" />;
  };

  const getDrainMessage = () => {
    if (estimatedDrain < 1) return "Minimal drain";
    if (estimatedDrain < 3) return "Moderate drain";
    if (estimatedDrain < 5) return "High drain";
    if (estimatedDrain < 10) return "Extreme drain";
    return "MAXIMUM OVERDRIVE";
  };

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
      <div className="flex items-center gap-3 mb-3">
        {getBatteryIcon()}
        <div>
          <h3 className="font-bold text-sm">Battery Status</h3>
          {batteryLevel !== null ? (
            <p className="text-xs text-muted-foreground">
              {batteryLevel}% {isCharging ? "(Charging)" : "remaining"}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Battery API not available</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {batteryLevel !== null && (
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                batteryLevel < 20 ? "bg-red-500" : batteryLevel < 50 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        )}

        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Est. Drain Rate</span>
          <span className="text-red-400 font-mono flex items-center gap-1">
            <Zap size={12} />
            ~{estimatedDrain.toFixed(1)}%/min
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Drain Level</span>
          <span className={`font-medium ${
            estimatedDrain < 3 ? "text-yellow-400" : estimatedDrain < 5 ? "text-orange-400" : "text-red-400"
          }`}>
            {getDrainMessage()}
          </span>
        </div>

        {timeToEmpty !== null && !isCharging && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Time to Empty</span>
            <span className="font-mono">{timeToEmpty} min</span>
          </div>
        )}
      </div>
    </div>
  );
};
