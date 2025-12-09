"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ImageFeedProps {
  scrollTrigger: number; // Increment to trigger scroll
}

export const ImageFeed = ({ scrollTrigger }: ImageFeedProps) => {
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
    if (scrollTrigger > 0 && containerRef.current) {
      const nextIndex = currentIndex + 1;
      const element = containerRef.current.children[nextIndex] as HTMLElement;
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setCurrentIndex(nextIndex);
      }
    }
  }, [scrollTrigger]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory py-8"
    >
      {images.map((id, index) => (
        <div
          key={id}
          className="h-full w-full flex-shrink-0 snap-center flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative w-full max-w-3xl h-[80%] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
              index === currentIndex 
                ? "ring-4 ring-primary shadow-primary/20" 
                : "opacity-40 blur-[2px] scale-95"
            }`}
          >
            <img
              src={`https://picsum.photos/seed/${id * 123}/1200/800`}
              alt={`Random ${id}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
              <h3 className="text-2xl font-bold">Image #{id}</h3>
              <p className="text-sm opacity-75">Scream to see the next one.</p>
            </div>
            
            {/* Current indicator */}
            {index === currentIndex && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                Current
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
};
