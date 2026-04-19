import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Utensils, Sparkles } from 'lucide-react';
import type { FoodItem } from '../../types';
import confetti from 'canvas-confetti';
import { WHEEL_COLORS } from '../../utils/colors';

interface ResultModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
}

function fireConfetti() {
  const colors = WHEEL_COLORS;
  [0.2, 0.5, 0.8].forEach((x, i) => {
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { x, y: 0.65 },
        colors,
        scalar: 0.9,
        ticks: 60,
        zIndex: 100,
      });
    }, i * 120);
  });
}

export function ResultModal({ food, isOpen, onClose, onSpinAgain }: ResultModalProps) {
  useEffect(() => {
    if (isOpen && food) fireConfetti();
  }, [isOpen, food]);

  return (
    <AnimatePresence>
      {isOpen && food && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-md z-40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed left-0 right-0 bottom-0 z-50 bg-app-bg rounded-t-[32px] overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
          >
            {/* decorative tints */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                background:
                  'radial-gradient(circle at 20% 10%, var(--color-primary) 0%, transparent 40%), radial-gradient(circle at 80% 20%, var(--color-accent) 0%, transparent 40%)',
              }}
            />

            <div className="relative px-6 pt-[14px] pb-9">
              {/* handle */}
              <div className="mx-auto mb-5 w-10 h-1 rounded-full bg-border" />

              {/* hero icon */}
              <div
                className="mx-auto mb-[18px] w-[76px] h-[76px] rounded-[24px] grid place-items-center relative animate-[pop-in_0.5s_cubic-bezier(0.2,1.4,0.4,1)]"
                style={{
                  background:
                    'linear-gradient(145deg, oklch(0.68 0.18 55), oklch(0.56 0.17 42))',
                  boxShadow: '0 20px 40px oklch(0.68 0.18 55 / 0.4)',
                }}
              >
                <Utensils size={36} strokeWidth={2} className="text-white" />
                <div
                  className="absolute -top-1.5 -right-1.5 animate-[wiggle_1.2s_ease-in-out_infinite]"
                  style={{ color: 'oklch(0.42 0.13 340)' }}
                >
                  <Sparkles size={20} fill="currentColor" />
                </div>
              </div>

              {/* eyebrow */}
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-2.5">
                — Today's pick —
              </p>

              {/* name */}
              <h2 className="text-center text-[36px] font-bold tracking-[-0.03em] text-ink leading-[1.1] mb-2">
                {food.name}
              </h2>

              {/* subtitle */}
              <p className="text-center text-[15px] italic text-muted mb-7">
                Bon appétit — enjoy your meal
              </p>

              {/* actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl border-[1.5px] border-border bg-transparent text-ink text-[15px] font-semibold active:scale-[0.97] transition-transform"
                >
                  Got it
                </button>
                <button
                  onClick={onSpinAgain}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-[0_8px_20px_oklch(0.68_0.18_55/0.4)]"
                >
                  <RotateCw size={16} strokeWidth={2.4} />
                  Spin again
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
