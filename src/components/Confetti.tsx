import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
  const pieces = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {pieces.map((piece) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720;
        const size = 4 + Math.random() * 8;

        return (
          <motion.div
            key={piece}
            className="absolute"
            style={{
              left: startX,
              top: -20,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 50,
              x: endX - startX,
              opacity: 0,
              rotate: rotation,
            }}
            transition={{
              duration,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}
    </div>
  );
};

export default Confetti;