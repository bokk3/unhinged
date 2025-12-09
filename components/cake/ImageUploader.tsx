"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onImageSelect, disabled }: ImageUploaderProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onImageSelect(url);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragOver 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Upload size={32} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg">Drop an image here</p>
              <p className="text-sm text-muted-foreground">
                or click to upload
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Is your dog actually cake? Let's find out.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <img 
            src={preview} 
            alt="Upload preview" 
            className="w-full h-64 object-cover"
          />
          {!disabled && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          )}
        </div>
      )}

      {/* Sample images for testing */}
      <div className="flex gap-2 justify-center">
        <p className="text-xs text-muted-foreground">No image? Try:</p>
        {[
          "https://picsum.photos/seed/dog1/400/300",
          "https://picsum.photos/seed/house1/400/300",
          "https://picsum.photos/seed/person1/400/300",
        ].map((url, i) => (
          <button
            key={i}
            onClick={() => { setPreview(url); onImageSelect(url); }}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Sample {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
