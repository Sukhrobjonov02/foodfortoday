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
  const activeIdx = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div
      className={clsx(
        'relative flex w-full rounded-[22px] p-[5px]',
        'bg-white/[0.82] backdrop-blur-[20px] backdrop-saturate-[1.8]',
        'border border-white/60',
        'shadow-[0_14px_32px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]'
      )}
    >
      <motion.div
        className="absolute top-[5px] bottom-[5px] rounded-[17px] bg-primary"
        style={{
          width: 'calc(50% - 5px)',
          boxShadow: '0 4px 12px oklch(0.68 0.18 55 / 0.4)',
        }}
        animate={{ left: activeIdx === 0 ? 5 : '50%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />

      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="relative z-10 flex-1 flex items-center justify-center gap-[7px] py-[10px] px-3"
          >
            <motion.span
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
              className="flex"
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={clsx(
                  'transition-colors',
                  isActive ? 'text-white' : 'text-muted'
                )}
              />
            </motion.span>
            <span
              className={clsx(
                'text-[14px] font-semibold tracking-[-0.01em] transition-colors',
                isActive ? 'text-white' : 'text-muted'
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
