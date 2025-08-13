import React from 'react';
import { motion } from 'framer-motion';

const LightRays: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg,
              rgba(255, 215, 0, 0.1) 45deg,
              transparent 90deg,
              rgba(255, 215, 0, 0.1) 135deg,
              transparent 180deg,
              rgba(255, 215, 0, 0.1) 225deg,
              transparent 270deg,
              rgba(255, 215, 0, 0.1) 315deg,
              transparent 360deg
            )
          `
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 45deg at 50% 50%, 
              transparent 0deg,
              rgba(255, 255, 255, 0.05) 22.5deg,
              transparent 45deg,
              rgba(255, 255, 255, 0.05) 67.5deg,
              transparent 90deg,
              rgba(255, 255, 255, 0.05) 112.5deg,
              transparent 135deg,
              rgba(255, 255, 255, 0.05) 157.5deg,
              transparent 180deg,
              rgba(255, 255, 255, 0.05) 202.5deg,
              transparent 225deg,
              rgba(255, 255, 255, 0.05) 247.5deg,
              transparent 270deg,
              rgba(255, 255, 255, 0.05) 292.5deg,
              transparent 315deg,
              rgba(255, 255, 255, 0.05) 337.5deg,
              transparent 360deg
            )
          `
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LightRays;