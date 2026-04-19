import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Tab } from '../types';

interface LayoutProps {
  children: ReactNode;
  bottomDock: ReactNode;
  activeTab: Tab;
}

export function Layout({ children, bottomDock, activeTab }: LayoutProps) {
  const prevTab = useRef(activeTab);
  const direction = activeTab === 'foods' ? -1 : 1;

  if (prevTab.current !== activeTab) {
    prevTab.current = activeTab;
  }

  return (
    <div
      className="relative h-svh flex flex-col bg-app-bg text-ink overflow-hidden"
      style={{ paddingBottom: 'var(--tg-safe-bottom, 0px)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-ink) 0.5px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />

      <main className="relative flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="relative shrink-0 px-4 pt-2 pb-3 flex flex-col gap-2.5">
        {bottomDock}
      </div>
    </div>
  );
}
