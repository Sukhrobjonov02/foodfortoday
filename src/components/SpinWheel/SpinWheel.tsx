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
    try {
      WebApp.HapticFeedback.notificationOccurred('success');
    } catch {}
  };

  const handleSpinAgain = () => {
    setShowResult(false);
    setSelectedFood(null);
  };

  if (foods.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <AlertCircle size={48} className="text-[var(--tg-theme-hint-color,#999)]" strokeWidth={1.5} />
        <h2 className="text-xl font-bold mt-4">Need more dishes!</h2>
        <p className="text-[var(--tg-theme-hint-color,#999)] mt-2">
          Add at least 2 foods to your list to spin the wheel.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold">Spin & Win</h1>
        <p className="text-sm text-[var(--tg-theme-hint-color,#999)] mt-1">
          Let the wheel decide your meal!
        </p>
      </div>

      <div className="flex justify-center pt-6">
        <Wheel
          foods={foods}
          isSpinning={isSpinning}
          onSpinStart={() => setIsSpinning(true)}
          onSpinComplete={handleSpinComplete}
        />
      </div>

      <ResultModal
        food={selectedFood}
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        onSpinAgain={handleSpinAgain}
      />
    </div>
  );
}
