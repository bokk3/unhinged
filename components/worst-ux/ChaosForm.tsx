"use client";

import { useState, useEffect, useRef } from "react";

interface ChaosFormProps {
  onFrustration?: () => void;
}

export const ChaosForm = ({ onFrustration }: ChaosFormProps) => {
  // Phone slider (0-9999999999)
  const [phone, setPhone] = useState(0);
  
  // DoB - year, month, day dropdowns
  const [dobYear, setDobYear] = useState(2024);
  const [dobMonth, setDobMonth] = useState(1);
  const [dobDay, setDobDay] = useState(1);
  
  // Password with peek-a-boo effect
  const [password, setPassword] = useState("");
  const [visibleChars, setVisibleChars] = useState<Set<number>>(new Set());
  
  // Name with restrictions
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  
  // Age in months
  const [ageMonths, setAgeMonths] = useState("");

  // Generate years since 1900
  const years = Array.from({ length: 125 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Password peek-a-boo effect
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Show last character briefly
    const lastIndex = newPassword.length - 1;
    if (lastIndex >= 0) {
      setVisibleChars(prev => new Set([...prev, lastIndex]));
      setTimeout(() => {
        setVisibleChars(prev => {
          const newSet = new Set(prev);
          newSet.delete(lastIndex);
          return newSet;
        });
      }, 100);
    }
    onFrustration?.();
  };

  // Name validation - max 3 chars, no vowels
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    const vowels = /[AEIOU]/g;
    
    if (value.length > 3) {
      setNameError("Maximum 3 characters allowed!");
      onFrustration?.();
      return;
    }
    
    if (vowels.test(value)) {
      setNameError("Vowels are not permitted in names!");
      onFrustration?.();
      return;
    }
    
    setName(value);
    setNameError("");
  };

  // Format phone number display
  const formatPhone = (num: number) => {
    const str = num.toString().padStart(10, "0");
    return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
  };

  // Render password with peek-a-boo
  const renderPassword = () => {
    return password.split("").map((char, i) => (
      visibleChars.has(i) ? char : "•"
    )).join("");
  };

  return (
    <div className="space-y-6">
      {/* Phone Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          type="range"
          min={0}
          max={9999999999}
          step={1}
          value={phone}
          onChange={(e) => { setPhone(Number(e.target.value)); onFrustration?.(); }}
          className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center font-mono text-lg">{formatPhone(phone)}</div>
        <p className="text-xs text-muted-foreground text-center">
          Slide to select your phone number (10 billion options)
        </p>
      </div>

      {/* Date of Birth Dropdowns */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date of Birth</label>
        <div className="flex gap-2">
          <select
            value={dobYear}
            onChange={(e) => { setDobYear(Number(e.target.value)); onFrustration?.(); }}
            className="flex-1 p-2 bg-secondary rounded-lg text-sm"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={dobMonth}
            onChange={(e) => { setDobMonth(Number(e.target.value)); onFrustration?.(); }}
            className="flex-1 p-2 bg-secondary rounded-lg text-sm"
          >
            {months.map(m => <option key={m} value={m}>Month {m}</option>)}
          </select>
          <select
            value={dobDay}
            onChange={(e) => { setDobDay(Number(e.target.value)); onFrustration?.(); }}
            className="flex-1 p-2 bg-secondary rounded-lg text-sm"
          >
            {days.map(d => <option key={d} value={d}>Day {d}</option>)}
          </select>
        </div>
      </div>

      {/* Name Input (Max 3 chars, no vowels) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Legal Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter name (max 3 chars, no vowels)"
          className="w-full p-3 bg-secondary rounded-lg"
        />
        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
      </div>

      {/* Age in Months */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Age (in months)</label>
        <input
          type="number"
          value={ageMonths}
          onChange={(e) => { setAgeMonths(e.target.value); onFrustration?.(); }}
          placeholder="How many months old are you?"
          className="w-full p-3 bg-secondary rounded-lg"
        />
        {ageMonths && (
          <p className="text-xs text-muted-foreground">
            That's approximately {Math.floor(Number(ageMonths) / 12)} years old
          </p>
        )}
      </div>

      {/* Password with Peek-a-Boo */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type="text"
            value={renderPassword()}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className="w-full p-3 bg-secondary rounded-lg font-mono tracking-widest"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Each character is visible for 0.1 seconds. Choose wisely.
        </p>
      </div>
    </div>
  );
};
