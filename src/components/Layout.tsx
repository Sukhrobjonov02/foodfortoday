import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#f8f9fa)] text-[var(--tg-theme-text-color,#1a1a2e)] flex flex-col">
      <div className="flex-1 pb-20">
        {children}
      </div>
    </div>
  );
}
