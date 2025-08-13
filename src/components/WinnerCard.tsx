import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WinnerCardProps {
  winningNumber: number;
  onPlayAgain: () => void;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winningNumber, onPlayAgain }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  useEffect(() => {
    // Play applause sound
    const audio = new Audio('/applause.mp3');
    audio.volume = 0.85;
    audio.play().catch(() => {
      // Ignore if audio can't play
    });
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative max-w-md w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          x.set(0);
          y.set(0);
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
      >
        <div 
          className="relative p-8 rounded-3xl glass-effect border-2 border-gold/30"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 215, 0, 0.1) 50%,
                rgba(255, 255, 255, 0.1) 100%
              )
            `,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 40px rgba(255, 215, 0, 0.3)
            `
          }}
        >
          {/* Holographic effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: `
                linear-gradient(45deg,
                  transparent 30%,
                  rgba(255, 255, 255, 0.1) 50%,
                  transparent 70%
                )
              `
            }}
            animate={isHovered ? { x: ['-100%', '100%'] } : {}}
            transition={{ duration: 1.5, ease: "linear" }}
          />

          <div className="relative z-10 text-center space-y-6">
            {/* Avatar */}
            <motion.div
              className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-gold shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=winner"
                alt="Winner avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Winning number */}
            <motion.h1
              className="text-6xl font-black text-winner-text"
              style={{
                textShadow: '0 0 30px hsl(var(--gold-glow))',
                filter: 'drop-shadow(0 0 10px hsl(var(--gold-glow)))'
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {winningNumber}
            </motion.h1>

            {/* Congratulations text */}
            <p className="text-lg text-foreground/90 font-medium">
              Congratulations, you are the lucky winner!
            </p>

            {/* Play again button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onPlayAgain}
                size="lg"
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">Play Again</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinnerCard;