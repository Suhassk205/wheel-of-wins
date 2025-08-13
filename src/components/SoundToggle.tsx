import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface SoundToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-6 right-6 w-12 h-12 rounded-full glass-effect flex items-center justify-center z-50 hover:scale-110 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isEnabled ? '0 0 20px hsl(var(--gold-glow))' : 'none'
      }}
      aria-label={isEnabled ? 'Disable sound' : 'Enable sound'}
    >
      {isEnabled ? (
        <Volume2 className="w-6 h-6 text-gold" />
      ) : (
        <VolumeX className="w-6 h-6 text-muted-foreground" />
      )}
    </motion.button>
  );
};

export default SoundToggle;