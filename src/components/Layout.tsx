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

  if (prevTab.current !== activeTab) {
    prevTab.current = activeTab;
  }

  return (
    <div className="relative min-h-screen bg-app-bg text-ink flex flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-ink) 0.5px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative flex-1 pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
