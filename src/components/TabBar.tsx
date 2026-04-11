import { UtensilsCrossed, Dices } from 'lucide-react';
import type { Tab } from '../types';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--tg-theme-bg-color,#ffffff)] border-t border-[var(--tg-theme-hint-color,#e0e0e0)]/20 flex">
      <button
        onClick={() => onTabChange('foods')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
          activeTab === 'foods'
            ? 'text-[var(--tg-theme-button-color,#6c5ce7)]'
            : 'text-[var(--tg-theme-hint-color,#999)]'
        }`}
      >
        <UtensilsCrossed size={22} />
        <span className="text-xs font-medium">My Foods</span>
      </button>
      <button
        onClick={() => onTabChange('spin')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
          activeTab === 'spin'
            ? 'text-[var(--tg-theme-button-color,#6c5ce7)]'
            : 'text-[var(--tg-theme-hint-color,#999)]'
        }`}
      >
        <Dices size={22} />
        <span className="text-xs font-medium">Spin & Win</span>
      </button>
    </div>
  );
}
