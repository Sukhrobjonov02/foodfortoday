import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { FoodItem } from '../../types';
import { Wheel } from './Wheel';
import { ResultModal } from './ResultModal';
import WebApp from '@twa-dev/sdk';

interface SpinWheelProps {
  foods: FoodItem[];
}

export function SpinWheel({ foods }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpinComplete = (food: FoodItem) => {
    setSelectedFood(food);
    setShowResult(true);
    setIsSpinning(false);
    try { WebApp.HapticFeedback.notificationOccurred('success'); } catch {}
  };

  const handleSpinAgain = () => {
    setShowResult(false);
    setSelectedFood(null);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="px-5 pt-[14px] pb-2">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-ink">
          Spin &amp; Win
        </h1>
        <p className="mt-0.5 text-sm text-muted">Let the wheel decide your meal</p>
      </div>

      {foods.length < 2 ? (
        <div className="flex-1 flex flex-col items-center gap-[14px] px-6 py-10 text-center">
          <div className="w-[88px] h-[88px] rounded-[28px] bg-surface-alt border border-border grid place-items-center">
            <AlertCircle size={40} strokeWidth={1.5} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">
            Add a few more dishes
          </h2>
          <p className="text-sm text-muted max-w-[260px] leading-snug">
            The wheel needs at least 2 dishes to do its job. Head to{' '}
            <span className="font-semibold text-primary">My Foods</span> to add more.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-7 px-5 pt-4">
          <Wheel
            foods={foods}
            isSpinning={isSpinning}
            onSpinStart={() => setIsSpinning(true)}
            onSpinComplete={handleSpinComplete}
          />
        </div>
      )}

      <ResultModal
        food={selectedFood}
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        onSpinAgain={handleSpinAgain}
      />
    </div>
  );
}
