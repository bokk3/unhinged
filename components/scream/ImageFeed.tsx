"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageFeedProps {
  shouldScroll: boolean;
  onScrollComplete: () => void;
}

export const ImageFeed = ({ shouldScroll, onScrollComplete }: ImageFeedProps) => {
  const [images, setImages] = useState<number[]>([1, 2, 3, 4, 5]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Infinite load logic
  useEffect(() => {
    if (currentIndex >= images.length - 2) {
      setImages(prev => [...prev, prev.length + 1, prev.length + 2, prev.length + 3]);
    }
  }, [currentIndex, images.length]);

  // Scroll trigger
  useEffect(() => {
    if (shouldScroll && containerRef.current) {
      const nextIndex = currentIndex + 1;
      const element = containerRef.current.children[nextIndex] as HTMLElement;
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setCurrentIndex(nextIndex);
        
        // Reset trigger after a delay (debounce)
        setTimeout(() => {
          onScrollComplete();
        }, 500);
      }
    }
  }, [shouldScroll, currentIndex, onScrollComplete]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden flex flex-col items-center gap-8 py-20"
    >
      {images.map((id, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-2xl aspect-[3/4] md:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
            index === currentIndex ? "ring-4 ring-primary scale-105 z-10" : "opacity-50 blur-[1px] scale-95"
          }`}
        >
          <img
            src={`https://picsum.photos/seed/${id * 123}/800/600`}
            alt={`Random ${id}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="text-xl font-bold">Image #{id}</h3>
            <p className="text-sm opacity-75">Scream to see the next one.</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
