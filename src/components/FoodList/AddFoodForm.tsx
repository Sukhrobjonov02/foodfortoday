import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import clsx from 'clsx';
import WebApp from '@twa-dev/sdk';

interface AddFoodFormProps {
  onAdd: (name: string) => Promise<void>;
  existingNames: string[];
}

export function AddFoodForm({ onAdd, existingNames }: AddFoodFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const openSheet = () => {
    setIsOpen(true);
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  };

  const closeSheet = () => {
    setIsOpen(false);
    setName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Food name cannot be empty');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name too long (max 50 chars)');
      return;
    }
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('This food is already in your list');
      return;
    }

    await onAdd(trimmed);
    setName('');
    setError('');
    closeSheet();

    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={openSheet}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        className={clsx(
          'fixed bottom-24 right-5 z-25 w-14 h-14 rounded-full',
          'bg-[var(--tg-theme-button-color,#6c5ce7)]',
          'text-[var(--tg-theme-button-text-color,#fff)]',
          'flex items-center justify-center',
          'shadow-lg shadow-[var(--tg-theme-button-color,#6c5ce7)]/30',
          'animate-[fab-pulse_2s_ease-in-out_infinite]'
        )}
      >
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSheet}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--tg-theme-bg-color,#fff)] rounded-t-2xl shadow-2xl"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[var(--tg-theme-hint-color,#ccc)]/40" />
              </div>

              <button
                onClick={closeSheet}
                className="absolute top-3 right-3 text-[var(--tg-theme-hint-color,#999)] p-2"
              >
                <X size={18} />
              </button>

              <div className="px-5 pt-2 pb-8">
                <h3 className="text-lg font-bold text-[var(--tg-theme-text-color,#1a1a2e)] mb-4">
                  Add a new dish
                </h3>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="What's cooking?"
                      className={clsx(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-[var(--tg-theme-secondary-bg-color,#f0f0f5)]',
                        'text-[var(--tg-theme-text-color,#1a1a2e)]',
                        'placeholder:text-[var(--tg-theme-hint-color,#999)]',
                        'outline-none transition-shadow',
                        'focus:ring-2 focus:ring-[var(--tg-theme-button-color,#6c5ce7)]/50'
                      )}
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-1.5 px-1">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={clsx(
                      'bg-[var(--tg-theme-button-color,#6c5ce7)]',
                      'text-[var(--tg-theme-button-text-color,#fff)]',
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'shrink-0 active:scale-95 transition-transform'
                    )}
                  >
                    <Plus size={22} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
