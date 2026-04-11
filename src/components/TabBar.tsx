import { motion } from 'framer-motion';
import { UtensilsCrossed, Dices } from 'lucide-react';
import clsx from 'clsx';
import type { Tab } from '../types';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'foods' as Tab, label: 'My Foods', Icon: UtensilsCrossed },
  { id: 'spin' as Tab, label: 'Spin & Win', Icon: Dices },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-20">
      <div className={clsx(
        'flex rounded-2xl overflow-hidden',
        'bg-[var(--tg-theme-bg-color,#ffffff)]/80',
        'backdrop-blur-xl',
        'border border-white/20',
        'shadow-lg shadow-black/10'
      )}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 relative flex flex-col items-center gap-1 py-3 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-1 rounded-xl bg-[var(--tg-theme-button-color,#6c5ce7)]/12"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1 : 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon
                  size={22}
                  className={clsx(
                    'transition-colors duration-200',
                    isActive
                      ? 'text-[var(--tg-theme-button-color,#6c5ce7)]'
                      : 'text-[var(--tg-theme-hint-color,#999)]'
                  )}
                />
              </motion.div>
              <span className={clsx(
                'text-xs font-medium relative z-10 transition-colors duration-200',
                isActive
                  ? 'text-[var(--tg-theme-button-color,#6c5ce7)]'
                  : 'text-[var(--tg-theme-hint-color,#999)]'
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
