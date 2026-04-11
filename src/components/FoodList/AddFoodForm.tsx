import { useState } from 'react';
import { Plus } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

interface AddFoodFormProps {
  onAdd: (name: string) => Promise<void>;
  existingNames: string[];
}

export function AddFoodForm({ onAdd, existingNames }: AddFoodFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

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

    setError('');
    await onAdd(trimmed);
    setName('');

    try {
      WebApp.HapticFeedback.impactOccurred('light');
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Add a dish..."
          className="w-full px-4 py-3 rounded-xl bg-[var(--tg-theme-secondary-bg-color,#f0f0f5)] text-[var(--tg-theme-text-color,#1a1a2e)] placeholder:text-[var(--tg-theme-hint-color,#999)] outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color,#6c5ce7)]/50 transition-shadow"
        />
        {error && (
          <p className="text-red-500 text-xs mt-1 px-2">{error}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-[var(--tg-theme-button-color,#6c5ce7)] text-[var(--tg-theme-button-text-color,#fff)] w-12 h-12 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
      >
        <Plus size={22} />
      </button>
    </form>
  );
}
