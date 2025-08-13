import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroWelcomeProps {
  onStartTimer: () => void;
}

const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStartTimer }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const text = "Welcome to spin game";
  const letters = text.split('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, letters.length * 100 + 500);
    
    return () => clearTimeout(timer);
  }, [letters.length]);

  return (
    <motion.div
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.68, -0.55, 0.265, 1.55]
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: animationComplete ? 1 : 0,
            scale: animationComplete ? 1 : 0.8
          }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={onStartTimer}
            size="lg"
            className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">Start Timer</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroWelcome;