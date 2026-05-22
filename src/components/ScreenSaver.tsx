import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScreenSaverProps {
  active: boolean;
  onWake: () => void;
}

const ScreenSaver: React.FC<ScreenSaverProps> = ({ active, onWake }) => {
  useEffect(() => {
    if (active) {
      const handleWake = () => onWake();
      window.addEventListener('mousemove', handleWake);
      window.addEventListener('keydown', handleWake);
      window.addEventListener('click', handleWake);
      return () => {
        window.removeEventListener('mousemove', handleWake);
        window.removeEventListener('keydown', handleWake);
        window.removeEventListener('click', handleWake);
      };
    }
  }, [active, onWake]);

  if (!active) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] bg-black cursor-none flex items-center justify-center"
    >
      <div className="absolute inset-0 opacity-20">
        {/* Floating Apple Logo Animation */}
        <motion.div
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <span className="text-white text-6xl font-bold"></span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScreenSaver;
