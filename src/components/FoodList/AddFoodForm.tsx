import { useState } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import WebApp from '@twa-dev/sdk';

interface AddFoodFormProps {
  onAdd: (name: string) => Promise<void>;
  existingNames: string[];
}

export function AddFoodForm({ onAdd, existingNames }: AddFoodFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const v = name.trim();
    if (!v) return setError('Type something first');
    if (v.length > 50) return setError('Too long (max 50)');
    if (existingNames.some((n) => n.toLowerCase() === v.toLowerCase())) {
      return setError('Already on your list');
    }

    await onAdd(v);
    setName('');
    setError('');
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="fixed left-4 right-4 bottom-[96px] z-20 flex justify-center">
      <div
        className={clsx(
          'flex items-center gap-2 p-1.5 rounded-[18px] w-full max-w-md',
          'bg-surface border border-border',
          'shadow-[0_10px_30px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]'
        )}
      >
        <input
          id="inline-composer-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={onKey}
          placeholder="What's cooking today?"
          maxLength={60}
          className="flex-1 bg-transparent border-none outline-none px-3 py-2.5 text-[15px] font-medium text-ink placeholder:text-hint"
        />
        <button
          onClick={submit}
          className={clsx(
            'shrink-0 w-10 h-10 rounded-[13px] grid place-items-center',
            'bg-primary text-white',
            'shadow-[0_4px_12px_oklch(0.68_0.18_55/0.4)]',
            'active:scale-95 transition-transform'
          )}
        >
          <Plus size={20} strokeWidth={2.4} />
        </button>
      </div>
      {error && (
        <p className="mt-1.5 ml-3.5 text-xs font-medium text-danger">{error}</p>
      )}
    </div>
  );
}
