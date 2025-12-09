"use client";

import { useEffect, useRef, useState } from "react";

interface GPUTortureProps {
  intensity: number; // 0-100
  enabled: boolean;
}

export const GPUTorture = ({ intensity, enabled }: GPUTortureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to fill container
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = lastTime;

    const render = () => {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      frameCount++;

      // Update FPS every second
      if (now - lastFpsUpdate > 1000) {
        setFps(Math.round(frameCount * 1000 / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      const time = now / 1000;
      const particles = Math.floor(50 + (intensity / 100) * 450);

      // Clear with trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 - (intensity / 1000)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw many particles with complex calculations
      for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2 + time * (1 + i * 0.01);
        const radius = Math.sin(time * 2 + i * 0.1) * 200 + 300;
        const x = canvas.width / 2 + Math.cos(angle * 3) * radius * Math.sin(time + i);
        const y = canvas.height / 2 + Math.sin(angle * 2) * radius * Math.cos(time + i);
        
        const hue = (i * 3 + time * 50) % 360;
        const size = 5 + Math.sin(time * 5 + i) * 3;
        
        // Expensive gradient for each particle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 1)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 100%, 50%, 0.5)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 100%, 30%, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Extra expensive: add blur effect manually
        if (intensity > 50) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.1)`;
          ctx.arc(x, y, size * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Extra chaos at high intensity
      if (intensity > 70) {
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const hue = Math.random() * 360;
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
          ctx.fillRect(x, y, 5, 5);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, intensity]);

  if (!enabled) {
    return (
      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
        <p className="text-muted-foreground">GPU Torture disabled</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-mono text-green-400">
        {fps} FPS | {Math.floor(50 + (intensity / 100) * 450)} particles
      </div>
    </div>
  );
};
