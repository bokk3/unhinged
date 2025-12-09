"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";

interface ClippyPopupProps {
  onDismiss: () => void;
  message: string;
}

export const ClippyPopup = ({ onDismiss, message }: ClippyPopupProps) => {
  const [closeButtonPosition, setCloseButtonPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  const [showTellMeMore, setShowTellMeMore] = useState(false);

  const handleCloseHover = () => {
    // Move the close button randomly
    if (hoverCount < 3) {
      setCloseButtonPosition({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 50,
      });
      setHoverCount(prev => prev + 1);
    } else {
      // After 3 hovers, change to "Tell me more"
      setShowTellMeMore(true);
    }
  };

  const handleTellMeMore = () => {
    // Reset and keep showing
    setHoverCount(0);
    setShowTellMeMore(false);
    setCloseButtonPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-20 right-6 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-3 bg-yellow-500 flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
          <Lightbulb size={18} className="text-white" />
        </div>
        <span className="font-bold text-black text-sm flex-1">Unhelpful Assistant</span>
        
        {/* Moving Close Button */}
        <motion.button
          animate={{ x: closeButtonPosition.x, y: closeButtonPosition.y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={handleCloseHover}
          onClick={showTellMeMore ? handleTellMeMore : onDismiss}
          className={`p-1 rounded-full transition-colors ${
            showTellMeMore 
              ? "bg-blue-500 text-white px-2" 
              : "bg-black/20 hover:bg-black/30 text-black"
          }`}
        >
          {showTellMeMore ? (
            <span className="text-xs font-medium">Tell me more!</span>
          ) : (
            <X size={14} />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Clippy-like character */}
          <div className="text-4xl">📎</div>
          <div>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 py-2 text-xs bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
        >
          I don't need help
        </button>
        <button
          onClick={handleTellMeMore}
          className="flex-1 py-2 text-xs bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
        >
          Get more advice!
        </button>
      </div>
    </motion.div>
  );
};
