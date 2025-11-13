import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  helperText?: string;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  helperText,
  leftLabel,
  rightLabel,
  disabled = false,
}: SliderProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{value}</span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
            'slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4',
            'slider-thumb:rounded-full slider-thumb:bg-blue-600',
            'slider-thumb:cursor-pointer slider-thumb:border-2 slider-thumb:border-white',
            'slider-thumb:shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
              ((value - min) / (max - min)) * 100
            }%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          {leftLabel && <span className="text-xs text-gray-500">{leftLabel}</span>}
          {rightLabel && <span className="text-xs text-gray-500">{rightLabel}</span>}
        </div>
      )}

      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
