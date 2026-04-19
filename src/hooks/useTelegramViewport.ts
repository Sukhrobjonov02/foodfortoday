import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

function writeVar(name: string, value: number) {
  document.documentElement.style.setProperty(name, `${value}px`);
}

export function useTelegramViewport() {
  useEffect(() => {
    const sync = () => {
      try {
        const safeBottom = WebApp.safeAreaInset?.bottom ?? 0;
        const contentSafeBottom = WebApp.contentSafeAreaInset?.bottom ?? 0;
        const vph = WebApp.viewportStableHeight ?? window.innerHeight;
        writeVar('--tg-safe-bottom', Math.max(safeBottom, contentSafeBottom));
        writeVar('--tg-viewport-stable-height', vph);
      } catch {
        // running outside Telegram — leave CSS env() fallback in place
      }
    };

    sync();

    const events: Array<
      'safeAreaChanged' | 'contentSafeAreaChanged' | 'viewportChanged'
    > = ['safeAreaChanged', 'contentSafeAreaChanged', 'viewportChanged'];

    events.forEach((e) => {
      try { WebApp.onEvent(e, sync); } catch {}
    });

    return () => {
      events.forEach((e) => {
        try { WebApp.offEvent(e, sync); } catch {}
      });
    };
  }, []);
}
