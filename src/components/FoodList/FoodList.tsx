import { AnimatePresence } from 'framer-motion';
import { Pizza } from 'lucide-react';
import type { FoodItem as FoodItemType } from '../../types';
import { AddFoodForm } from './AddFoodForm';
import { FoodItem } from './FoodItem';

interface FoodListProps {
  foods: FoodItemType[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: string) => void;
}

export function FoodList({ foods, onAdd, onRemove }: FoodListProps) {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold">My Foods</h1>
        <p className="text-sm text-[var(--tg-theme-hint-color,#999)] mt-1">
          {foods.length} dish{foods.length !== 1 ? 'es' : ''} in your list
        </p>
      </div>

      <AddFoodForm onAdd={onAdd} existingNames={foods.map((f) => f.name)} />

      <div className="overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {foods.map((food) => (
            <FoodItem key={food.id} item={food} onRemove={onRemove} />
          ))}
        </AnimatePresence>

        {foods.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--tg-theme-hint-color,#999)]">
            <Pizza size={48} strokeWidth={1.5} />
            <p className="mt-4 text-lg font-medium">No dishes yet</p>
            <p className="text-sm mt-1">Add your favorite foods above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
