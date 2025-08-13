import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import HeroWelcome from '@/components/HeroWelcome';
import RollingCounter from '@/components/RollingCounter';
import SpinningWheel from '@/components/SpinningWheel';
import SoundToggle from '@/components/SoundToggle';
import LightRays from '@/components/LightRays';
import Confetti from '@/components/Confetti';
import WinnerCard from '@/components/WinnerCard';
import { useSound } from '@/hooks/useSound';
import confetti from 'canvas-confetti';

type GameStage = 'welcome' | 'countdown' | 'luck-text' | 'spin-ready' | 'range-wheel' | 'number-wheel' | 'result';

interface WheelSegment {
  id: string;
  label: string;
  color: string;
}

const Success: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('welcome');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRangeSpinning, setIsRangeSpinning] = useState(false);
  const [isNumberSpinning, setIsNumberSpinning] = useState(false);
  const [selectedRange, setSelectedRange] = useState<WheelSegment | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinnerCard, setShowWinnerCard] = useState(false);

  const { playClick, playSpin, playWinner, playRangeSelected } = useSound(soundEnabled);

  // Wheel data
  const rangeSegments: WheelSegment[] = [
    { id: '1', label: '1-10', color: '#ff6b6b' },
    { id: '2', label: '11-20', color: '#4ecdc4' },
    { id: '3', label: '21-30', color: '#45b7d1' },
    { id: '4', label: '31-40', color: '#96ceb4' },
    { id: '5', label: '41-50', color: '#feca57' },
    { id: '6', label: '51-60', color: '#ff9ff3' },
    { id: '7', label: '61-70', color: '#54a0ff' },
    { id: '8', label: '71-80', color: '#5f27cd' },
    { id: '9', label: '81-90', color: '#00d2d3' },
    { id: '10', label: '91-100', color: '#ff9f43' }
  ];

  const numberSegments: WheelSegment[] = Array.from({ length: 10 }, (_, i) => ({
    id: `num-${i + 1}`,
    label: (i + 1).toString(),
    color: rangeSegments[i].color
  }));

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setStage('luck-text');
      setTimeout(() => setStage('spin-ready'), 3000);
    }
  }, [isTimerRunning, timeLeft]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (stage === 'range-wheel' && !isRangeSpinning) {
          handleRangeSpin();
        } else if (stage === 'number-wheel' && !isNumberSpinning) {
          handleNumberSpin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage, isRangeSpinning, isNumberSpinning]);

  const handleStartTimer = useCallback(() => {
    playClick();
    setStage('countdown');
    setIsTimerRunning(true);
  }, [playClick]);

  const handleTimerToggle = useCallback(() => {
    playClick();
    setIsTimerRunning(!isTimerRunning);
  }, [isTimerRunning, playClick]);

  const handleSpinNow = useCallback(() => {
    playClick();
    setStage('range-wheel');
  }, [playClick]);

  const handleRangeSpin = useCallback(() => {
    if (isRangeSpinning) return;
    playSpin();
    setIsRangeSpinning(true);
  }, [isRangeSpinning, playSpin]);

  const handleRangeComplete = useCallback((segment: WheelSegment) => {
    setSelectedRange(segment);
    setIsRangeSpinning(false);
    playRangeSelected();
    
    setTimeout(() => {
      setStage('number-wheel');
    }, 1500);
  }, [playRangeSelected]);

  const handleNumberSpin = useCallback(() => {
    if (isNumberSpinning) return;
    playSpin();
    setIsNumberSpinning(true);
  }, [isNumberSpinning, playSpin]);

  const handleNumberComplete = useCallback((segment: WheelSegment) => {
    const number = parseInt(segment.label);
    setSelectedNumber(number);
    setIsNumberSpinning(false);
    
    // Trigger celebrations
    playWinner();
    setShowConfetti(true);
    
    // Canvas confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setStage('result');
      setShowWinnerCard(true);
    }, 2000);
  }, [playWinner]);

  const handlePlayAgain = useCallback(() => {
    // Reset all state
    setStage('countdown');
    setTimeLeft(10);
    setIsTimerRunning(false);
    setIsRangeSpinning(false);
    setIsNumberSpinning(false);
    setSelectedRange(null);
    setSelectedNumber(null);
    setShowConfetti(false);
    setShowWinnerCard(false);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SoundToggle 
        isEnabled={soundEnabled} 
        onToggle={() => setSoundEnabled(!soundEnabled)} 
      />

      {(stage === 'luck-text' || stage === 'spin-ready') && <LightRays />}
      
      <Confetti show={showConfetti} />

      <AnimatePresence mode="wait">
        {stage === 'welcome' && (
          <HeroWelcome onStartTimer={handleStartTimer} />
        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
              Get Ready!
            </h1>
            
            <RollingCounter value={timeLeft} maxValue={10} />
            
            <Button
              onClick={handleTimerToggle}
              size="lg"
              className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-full"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
          </motion.div>
        )}

        {stage === 'luck-text' && (
          <motion.div
            key="luck-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-black text-center text-foreground px-4"
              style={{
                textShadow: '0 0 40px hsl(var(--gold-glow))'
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 40px hsl(var(--gold-glow))',
                  '0 0 80px hsl(var(--gold-glow))',
                  '0 0 40px hsl(var(--gold-glow))'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Luck is all that matters!
            </motion.h1>
          </motion.div>
        )}

        {stage === 'spin-ready' && (
          <motion.div
            key="spin-ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                onClick={handleSpinNow}
                size="lg"
                className="px-16 py-8 text-2xl font-black bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full transform hover:scale-110 transition-all duration-300 relative overflow-hidden animate-glow"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">SPIN NOW</span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {stage === 'range-wheel' && (
          <motion.div
            key="range-wheel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center space-y-8 p-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Spin the Range Wheel
            </h2>
            
            <SpinningWheel
              segments={rangeSegments}
              size={300}
              isSpinning={isRangeSpinning}
              onSpinComplete={handleRangeComplete}
              pointerLabel="PICK"
              selectedSegment={selectedRange}
            />
            
            <Button
              onClick={handleRangeSpin}
              disabled={isRangeSpinning}
              size="lg"
              className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full disabled:opacity-50"
            >
              {isRangeSpinning ? 'Spinning...' : 'Spin Range Wheel'}
            </Button>
            
            <p className="text-muted-foreground text-center">
              Press Space or Enter to spin
            </p>
          </motion.div>
        )}

        {stage === 'number-wheel' && (
          <motion.div
            key="number-wheel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center space-y-8 p-4"
          >
            {selectedRange && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
              >
                <h3 className="text-xl font-semibold text-gold mb-2">Range Selected:</h3>
                <p className="text-2xl font-bold text-foreground">{selectedRange.label}</p>
              </motion.div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Spin the Number Wheel
            </h2>
            
            <SpinningWheel
              segments={numberSegments}
              size={200}
              isSpinning={isNumberSpinning}
              onSpinComplete={handleNumberComplete}
              pointerLabel="WINNER"
            />
            
            <Button
              onClick={handleNumberSpin}
              disabled={isNumberSpinning}
              size="lg"
              className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-full disabled:opacity-50"
            >
              {isNumberSpinning ? 'Spinning...' : 'Spin Number Wheel'}
            </Button>
            
            <p className="text-muted-foreground text-center">
              Press Space or Enter to spin
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showWinnerCard && selectedNumber && (
        <WinnerCard
          winningNumber={selectedNumber}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default Success;