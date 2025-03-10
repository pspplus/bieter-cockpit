
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Normalize to a 0-4 scale
    return Math.min(4, Math.floor(score / 1.5));
  }, [password]);
  
  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Sehr schwach';
      case 1: return 'Schwach';
      case 2: return 'Mittel';
      case 3: return 'Stark';
      case 4: return 'Sehr stark';
      default: return '';
    }
  };
  
  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1: return 'bg-destructive';
      case 2: return 'bg-amber-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-tender-200';
    }
  };
  
  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex items-center justify-between">
        <div className="h-2 w-full bg-tender-100 rounded-full overflow-hidden flex">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-full w-1/4 transition-all duration-300 ease-in-out",
                index < strength ? getStrengthColor() : "bg-tender-100"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-tender-600">
        Passwortstärke: <span className="font-medium">{getStrengthLabel()}</span>
      </p>
    </div>
  );
}
