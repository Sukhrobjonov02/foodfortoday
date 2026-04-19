import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import clsx from 'clsx';
import type { FoodItem as FoodItemType } from '../../types';
import WebApp from '@twa-dev/sdk';

interface FoodItemProps {
  item: FoodItemType;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
  existingNames: string[];
}

export function FoodItem({ item, index, onRemove, onUpdate, existingNames }: FoodItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const [editError, setEditError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dragX = useMotionValue(0);
  const deleteOpacity = useTransform(dragX, [-100, -40, 0], [1, 0.5, 0]);
  const deleteScale = useTransform(dragX, [-100, -40, 0], [1, 0.8, 0.5]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRemove = () => {
    try { WebApp.HapticFeedback.notificationOccurred('warning'); } catch {}
    onRemove(item.id);
  };

  const startEditing = () => {
    setEditValue(item.name);
    setEditError('');
    setIsEditing(true);
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditError('');
    setEditValue(item.name);
  };

  const saveEdit = async () => {
    const trimmed = editValue.trim();
    if (!trimmed) return setEditError('Name this dish');
    if (trimmed.length > 50) return setEditError('Too long (max 50)');
    if (
      trimmed.toLowerCase() !== item.name.toLowerCase() &&
      existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    ) {
      return setEditError('Already on your list');
    }
    if (trimmed === item.name) return cancelEditing();
    await onUpdate(item.id, trimmed);
    setIsEditing(false);
    setEditError('');
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className="relative mb-2 rounded-[20px] overflow-hidden">
      {/* delete track */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-0 flex items-center justify-end pr-5"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--color-danger) 70%)',
          }}
        />
        <motion.div style={{ scale: deleteScale }} className="relative">
          <Trash2 size={20} className="text-white" />
        </motion.div>
      </motion.div>

      {/* card */}
      <motion.div
        drag={isEditing ? false : 'x'}
        dragConstraints={{ left: -100, right: 0 }}
        dragDirectionLock
        dragSnapToOrigin
        dragElastic={0.1}
        style={{ x: dragX }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) handleRemove();
        }}
        className={clsx(
          'relative flex items-center gap-3',
          'px-4 py-3 rounded-[20px]',
          'bg-surface border border-border',
          'shadow-[0_1px_0_var(--color-border-soft),0_1px_2px_rgba(0,0,0,0.03)]',
          'touch-pan-y select-none',
          isEditing ? 'cursor-default' : 'cursor-grab'
        )}
      >
        {/* index chip */}
        <div className="shrink-0 w-8 h-8 rounded-[10px] bg-surface-alt border border-border-soft grid place-items-center font-mono text-xs font-semibold text-muted tracking-[-0.02em]">
          {String(index + 1).padStart(2, '0')}
        </div>

        {isEditing ? (
          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                if (editError) setEditError('');
              }}
              onKeyDown={handleKeyDown}
              maxLength={60}
              className={clsx(
                'w-full bg-transparent outline-none',
                'text-[17px] font-medium text-ink tracking-[-0.01em]',
                'border-b-[1.5px] py-0.5',
                editError ? 'border-danger' : 'border-primary'
              )}
            />
            {editError && (
              <p className="mt-1 text-xs text-danger">{editError}</p>
            )}
          </div>
        ) : (
          <div className="flex-1 min-w-0 truncate text-[17px] font-medium text-ink tracking-[-0.01em]">
            {item.name}
          </div>
        )}

        <div className="flex gap-1 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={saveEdit}
                className="w-8 h-8 rounded-[10px] grid place-items-center bg-success active:scale-90 transition-transform"
              >
                <Check size={18} className="text-white" strokeWidth={2.4} />
              </button>
              <button
                onClick={cancelEditing}
                className="w-8 h-8 rounded-[10px] grid place-items-center bg-surface-alt border border-border-soft active:scale-90 transition-transform"
              >
                <X size={18} className="text-muted" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEditing}
                className="w-8 h-8 rounded-[10px] grid place-items-center bg-surface-alt border border-border-soft active:scale-90 transition-transform"
              >
                <Pencil size={16} className="text-muted" />
              </button>
              <button
                onClick={handleRemove}
                className="w-8 h-8 rounded-[10px] grid place-items-center bg-surface-alt border border-border-soft active:scale-90 transition-transform"
              >
                <Trash2 size={16} className="text-muted" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
