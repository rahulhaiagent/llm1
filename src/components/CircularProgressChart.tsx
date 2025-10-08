import React from 'react';

interface CircularProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  showText?: boolean;
  textClassName?: string;
  label?: string;
  labelClassName?: string;
}

/**
 * A circular progress chart component that displays a percentage as a circular progress bar
 * with customizable colors, size, and stroke width.
 */
export default function CircularProgressChart({
  percentage,
  size = 128,
  strokeWidth = 10,
  primaryColor = '#10b981', // Green by default
  secondaryColor = '#ef4444', // Red by default
  backgroundColor = '#e5e7eb', // Light gray by default
  showText = true,
  textClassName = 'text-2xl font-bold text-gray-900',
  label,
  labelClassName = 'text-sm font-medium text-gray-600 mt-2'
}: CircularProgressChartProps) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  const remainingPercentage = 100 - normalizedPercentage;
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = size;
  const center = viewBoxSize / 2;
  
  // Calculate dash offsets
  const primaryOffset = circumference * (1 - normalizedPercentage / 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          className="transform -rotate-90" 
          width={size} 
          height={size} 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Primary segment (e.g., Safe or Jailbreaking Resistance) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={primaryOffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Secondary segment (e.g., Unsafe or Failed Jailbreaking) */}
          {remainingPercentage > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={secondaryColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference * remainingPercentage / 100} ${circumference}`}
              strokeDashoffset={0}
              className="transition-all duration-1000 ease-out"
              transform={`rotate(${normalizedPercentage * 3.6} ${center} ${center})`}
            />
          )}
        </svg>
        
        {/* Percentage text in the center */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={textClassName}>
              {normalizedPercentage}%
            </span>
          </div>
        )}
      </div>
      
      {/* Optional label below the chart */}
      {label && (
        <div className={labelClassName}>
          {label}
        </div>
      )}
    </div>
  );
} 