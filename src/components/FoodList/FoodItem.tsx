import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { FoodItem as FoodItemType } from '../../types';
import WebApp from '@twa-dev/sdk';

interface FoodItemProps {
  item: FoodItemType;
  onRemove: (id: string) => void;
}

export function FoodItem({ item, onRemove }: FoodItemProps) {
  const handleRemove = () => {
    try {
      WebApp.HapticFeedback.notificationOccurred('warning');
    } catch {}
    onRemove(item.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between px-4 py-3 mx-4 mb-2 rounded-xl bg-[var(--tg-theme-secondary-bg-color,#f0f0f5)]"
    >
      <span className="font-medium truncate mr-3">{item.name}</span>
      <button
        onClick={handleRemove}
        className="text-[var(--tg-theme-hint-color,#999)] hover:text-red-500 transition-colors shrink-0 p-1"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
