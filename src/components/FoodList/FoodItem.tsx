import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import clsx from 'clsx';
import type { FoodItem as FoodItemType } from '../../types';
import WebApp from '@twa-dev/sdk';

interface FoodItemProps {
  item: FoodItemType;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
  existingNames: string[];
}

export function FoodItem({ item, onRemove, onUpdate, existingNames }: FoodItemProps) {
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
    if (!trimmed) {
      setEditError('Name cannot be empty');
      return;
    }
    if (trimmed.length > 50) {
      setEditError('Too long (max 50)');
      return;
    }
    if (
      trimmed.toLowerCase() !== item.name.toLowerCase() &&
      existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    ) {
      setEditError('Already exists');
      return;
    }
    if (trimmed === item.name) {
      cancelEditing();
      return;
    }
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
    <div className="relative mx-4 mb-2.5">
      {/* Swipe delete indicator */}
      <motion.div
        style={{ opacity: deleteOpacity, scale: deleteScale }}
        className="absolute inset-0 rounded-2xl bg-red-500 flex items-center justify-end pr-5"
      >
        <Trash2 size={20} className="text-white" />
      </motion.div>

      {/* Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -120, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragDirectionLock
        dragSnapToOrigin
        dragElastic={0.1}
        style={{ x: dragX }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) handleRemove();
        }}
        className="relative flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[var(--tg-theme-secondary-bg-color,#f0f0f5)] shadow-sm shadow-black/5 border border-white/40"
      >
        {isEditing ? (
          <div className="flex-1 flex flex-col mr-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  if (editError) setEditError('');
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none font-medium text-[var(--tg-theme-text-color,#1a1a2e)] border-b-2 border-[var(--tg-theme-button-color,#6c5ce7)] py-0.5"
              />
              <button onClick={saveEdit} className="text-green-500 p-1">
                <Check size={18} />
              </button>
              <button onClick={cancelEditing} className="text-[var(--tg-theme-hint-color,#999)] p-1">
                <X size={18} />
              </button>
            </div>
            {editError && (
              <p className="text-red-500 text-xs mt-1">{editError}</p>
            )}
          </div>
        ) : (
          <>
            <span className="font-medium truncate mr-3 text-[var(--tg-theme-text-color,#1a1a2e)]">
              {item.name}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={startEditing}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  'text-[var(--tg-theme-hint-color,#999)]',
                  'hover:text-[var(--tg-theme-button-color,#6c5ce7)]',
                  'hover:bg-[var(--tg-theme-button-color,#6c5ce7)]/10'
                )}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={handleRemove}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  'text-[var(--tg-theme-hint-color,#999)]',
                  'hover:text-red-500 hover:bg-red-500/10'
                )}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
