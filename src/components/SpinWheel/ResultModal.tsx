import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Utensils } from 'lucide-react';
import type { FoodItem } from '../../types';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
}

function fireConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  confetti({ ...defaults, particleCount: 50, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.7, y: 0.6 } });

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.4 }, startVelocity: 45 });
  }, 150);
}

export function ResultModal({ food, isOpen, onClose, onSpinAgain }: ResultModalProps) {
  useEffect(() => {
    if (isOpen && food) {
      fireConfetti();
    }
  }, [isOpen, food]);

  return (
    <AnimatePresence>
      {isOpen && food && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--tg-theme-bg-color,#fff)] rounded-t-3xl shadow-2xl overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--tg-theme-hint-color,#ccc)]/40" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-[var(--tg-theme-hint-color,#999)] p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center px-6 pt-2 pb-10">
              {/* Food image placeholder */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-28 h-28 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200/50 flex items-center justify-center mb-4 shadow-sm"
              >
                <Utensils size={40} className="text-orange-400" strokeWidth={1.5} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-[var(--tg-theme-hint-color,#999)] font-semibold uppercase tracking-widest"
              >
                Today's pick
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mt-2 mb-1 text-[var(--tg-theme-text-color,#1a1a2e)]"
              >
                {food.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-[var(--tg-theme-hint-color,#999)] mb-6"
              >
                Bon appetit!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex gap-3 w-full"
              >
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-[var(--tg-theme-hint-color,#ddd)]/30 text-[var(--tg-theme-text-color,#333)] font-semibold transition-colors active:scale-[0.97]"
                >
                  Got it!
                </button>
                <button
                  onClick={onSpinAgain}
                  className="flex-1 py-3.5 rounded-xl bg-[var(--tg-theme-button-color,#6c5ce7)] text-[var(--tg-theme-button-text-color,#fff)] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-md"
                >
                  <RotateCcw size={16} />
                  Spin Again
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
