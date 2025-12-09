"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalHellProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalHell = ({ isOpen, onClose }: ModalHellProps) => {
  const [modals, setModals] = useState<number[]>([1]);
  const [closeButtonPos, setCloseButtonPos] = useState({ x: 0, y: 0 });

  const spawnMoreModals = () => {
    // Hydra effect: close one, two more appear
    setModals(prev => [...prev, prev.length + 1, prev.length + 2]);
  };

  const handleBackgroundClick = () => {
    // Background click spawns more modals
    spawnMoreModals();
  };

  const handleCloseClick = (id: number) => {
    if (modals.length === 1) {
      onClose();
    } else {
      // Remove this modal but spawn more
      setModals(prev => prev.filter(m => m !== id));
      spawnMoreModals();
    }
  };

  const moveCloseButton = () => {
    setCloseButtonPos({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <AnimatePresence>
        {modals.map((id, index) => (
          <motion.div
            key={id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              x: (index % 3 - 1) * 50,
              y: Math.floor(index / 3) * 30,
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bg-card border border-border rounded-xl p-6 shadow-2xl max-w-sm"
            style={{ zIndex: 50 + index }}
          >
            {/* Tiny, moving close button */}
            <motion.button
              animate={closeButtonPos}
              onMouseEnter={moveCloseButton}
              onClick={() => handleCloseClick(id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
            >
              <X size={8} />
            </motion.button>

            <h3 className="text-lg font-bold mb-2">Important Notice #{id}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We value your privacy. By closing this modal, you agree to receive 
              more modals. Click anywhere to subscribe to our modal newsletter.
            </p>
            <p className="text-xs text-red-500">
              ({modals.length} modal{modals.length > 1 ? "s" : ""} active)
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
