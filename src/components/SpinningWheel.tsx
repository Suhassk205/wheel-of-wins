import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WheelSegment {
  id: string;
  label: string;
  color: string;
}

interface SpinningWheelProps {
  segments: WheelSegment[];
  size: number;
  isSpinning: boolean;
  onSpinComplete: (selectedSegment: WheelSegment) => void;
  pointerLabel: string;
  selectedSegment?: WheelSegment | null;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({
  segments,
  size,
  isSpinning,
  onSpinComplete,
  pointerLabel,
  selectedSegment
}) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const segmentAngle = 360 / segments.length;

  useEffect(() => {
    if (isSpinning) {
      // Generate random spins between 1080 and 2160 degrees (3-6 full rotations)
      const randomSpins = Math.floor(Math.random() * 1080) + 1080;
      const randomSegmentIndex = Math.floor(Math.random() * segments.length);
      const targetAngle = randomSegmentIndex * segmentAngle;
      const finalRotation = randomSpins + (360 - targetAngle) + (segmentAngle / 2);
      
      setRotation(prev => prev + finalRotation);
      
      // Complete spin after animation
      setTimeout(() => {
        onSpinComplete(segments[randomSegmentIndex]);
      }, 3000);
    }
  }, [isSpinning, segments, segmentAngle, onSpinComplete]);

  const createSegmentPath = (index: number): string => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
  };

  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const radius = (size / 2 - 10) * 0.7;
    const centerX = size / 2;
    const centerY = size / 2;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle) + 5
    };
  };

  return (
    <div className="relative">
      <motion.svg
        ref={wheelRef}
        width={size}
        height={size}
        className="drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))'
        }}
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? 3 : 0,
          ease: [0.17, 0.67, 0.83, 0.67]
        }}
      >
        {/* Segments */}
        {segments.map((segment, index) => {
          const isSelected = selectedSegment?.id === segment.id;
          return (
            <g key={segment.id}>
              <defs>
                <linearGradient id={`gradient-${segment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={segment.color} stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d={createSegmentPath(index)}
                fill={`url(#gradient-${segment.id})`}
                stroke="white"
                strokeWidth="2"
                className={`transition-all duration-300 ${isSelected ? 'wheel-segment-glow' : ''}`}
                style={isSelected ? { filter: 'drop-shadow(0 0 15px currentColor)' } : {}}
              />
              <text
                x={getTextPosition(index).x}
                y={getTextPosition(index).y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`font-bold text-white ${size > 250 ? 'text-xs' : 'text-sm'}`}
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontSize: size > 250 ? '12px' : '14px'
                }}
              >
                {segment.label}
              </text>
            </g>
          );
        })}

        {/* Center cap */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="25"
          fill="url(#centerGradient)"
          stroke="white"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r="15"
          fill="white"
        />

        <defs>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-glow))" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Pointer */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10"
        style={{ marginTop: '10px' }}
      >
        <div className="relative">
          <div 
            className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-gold animate-glow"
            style={{
              filter: 'drop-shadow(0 0 10px hsl(var(--gold-glow)))'
            }}
          />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              {pointerLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinningWheel;