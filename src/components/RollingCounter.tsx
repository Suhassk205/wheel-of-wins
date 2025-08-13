import React from 'react';
import { motion } from 'framer-motion';

interface RollingCounterProps {
  value: number;
  maxValue: number;
}

const RollingCounter: React.FC<RollingCounterProps> = ({ value, maxValue }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const { minutes, seconds } = formatTime(value);

  const DigitColumn = ({ digit }: { digit: string }) => {
    const numDigit = parseInt(digit);
    
    return (
      <div className="relative overflow-hidden h-24 w-16 bg-card rounded-lg border-2 border-gold/30 shadow-lg">
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={{ y: -numDigit * 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-24 w-full flex items-center justify-center text-4xl font-bold text-gold"
              style={{
                textShadow: '0 0 20px hsl(var(--gold-glow))'
              }}
            >
              {i}
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex space-x-2">
        <DigitColumn digit={minutes[0]} />
        <DigitColumn digit={minutes[1]} />
      </div>
      
      <motion.div
        className="text-4xl font-bold text-gold"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        :
      </motion.div>
      
      <div className="flex space-x-2">
        <DigitColumn digit={seconds[0]} />
        <DigitColumn digit={seconds[1]} />
      </div>
    </div>
  );
};

export default RollingCounter;