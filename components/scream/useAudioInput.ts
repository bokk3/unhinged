"use client";

import { useState, useEffect, useRef } from "react";

export const useAudioInput = () => {
  const [volume, setVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      setIsListening(true);
      analyze();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsListening(false);
    setVolume(0);
  };

  const analyze = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Normalize to 0-100 roughly
    // Typical speech might be around 30-50, screaming 80-100
    const normalized = Math.min(100, Math.round((average / 255) * 200)); 
    
    setVolume(normalized);
    requestRef.current = requestAnimationFrame(analyze);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return { volume, isListening, startListening, stopListening };
};
