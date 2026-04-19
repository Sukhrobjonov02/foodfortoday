import { AnimatePresence, motion } from 'framer-motion';
import { Pizza, Sparkles, Plus } from 'lucide-react';
import type { FoodItem as FoodItemType } from '../../types';
import { AddFoodForm } from './AddFoodForm';
import { FoodItem } from './FoodItem';

interface FoodListProps {
  foods: FoodItemType[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
}

function EmptyState({ onFocus }: { onFocus: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[14px] px-6 py-16">
      <div className="relative grid place-items-center w-[88px] h-[88px] rounded-[28px] bg-gradient-to-br from-surface to-surface-alt border border-border shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <Pizza size={44} strokeWidth={1.5} className="text-primary" />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-primary grid place-items-center shadow-[0_4px_12px_oklch(0.68_0.18_55/0.4)]">
          <Sparkles size={14} strokeWidth={2} className="text-white" />
        </div>
      </div>
      <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">
        Your menu is empty
      </h2>
      <p className="text-sm text-muted max-w-[240px] leading-snug">
        Add a few dishes you love — we'll help you decide what to eat today.
      </p>
      <button
        onClick={onFocus}
        className="mt-2 flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-primary text-white text-[15px] font-semibold shadow-[0_8px_22px_oklch(0.68_0.18_55/0.35)] active:scale-[0.97] transition-transform"
      >
        <Plus size={16} strokeWidth={2.2} />
        Add a dish
      </button>
    </div>
  );
}

export function FoodList({ foods, onAdd, onRemove, onUpdate }: FoodListProps) {
  const existingNames = foods.map((f) => f.name);

  return (
    <div className="relative">
      <div className="px-5 pt-[14px] pb-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-ink">
            My Foods
          </h1>
          <span className="font-mono text-[13px] font-medium tracking-[-0.02em] text-muted">
            {foods.length}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {foods.length === 0
            ? 'Build your personal menu'
            : foods.length === 1
            ? '1 dish saved'
            : `${foods.length} dishes saved`}
        </p>
      </div>

      <div className="px-4 pt-2 pb-[180px] overflow-y-auto">
        {foods.length === 0 ? (
          <EmptyState onFocus={() => {
            const input = document.getElementById('inline-composer-input') as HTMLInputElement | null;
            input?.focus();
          }} />
        ) : (
          <AnimatePresence mode="popLayout">
            {foods.map((food, i) => (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -120, transition: { duration: 0.2 } }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <FoodItem
                  index={i}
                  item={food}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  existingNames={existingNames}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <AddFoodForm onAdd={onAdd} existingNames={existingNames} />
    </div>
  );
}
