import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Tab } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: Tab;
}

export function Layout({ children, activeTab }: LayoutProps) {
  const prevTab = useRef(activeTab);
  const direction = activeTab === 'foods' ? -1 : 1;

  // Update previous tab after computing direction
  if (prevTab.current !== activeTab) {
    prevTab.current = activeTab;
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#f8f9fa)] text-[var(--tg-theme-text-color,#1a1a2e)] flex flex-col overflow-hidden">
      <div className="flex-1 pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
