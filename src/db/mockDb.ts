import type { FoodItem } from '../types';

const STORAGE_KEY = 'foodfortoday_items';

const DEFAULT_ITEMS: FoodItem[] = [
  { id: '1', name: 'Palov', createdAt: Date.now() },
  { id: '2', name: 'Lag\'mon', createdAt: Date.now() },
  { id: '3', name: 'Sho\'rva', createdAt: Date.now() },
  { id: '4', name: 'Manti', createdAt: Date.now() },
];

function readStorage(): FoodItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
  }
  return JSON.parse(raw);
}

function writeStorage(items: FoodItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const mockDb = {
  async getAll(): Promise<FoodItem[]> {
    return readStorage();
  },

  async add(name: string): Promise<FoodItem> {
    const items = readStorage();
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    items.push(newItem);
    writeStorage(items);
    return newItem;
  },

  async remove(id: string): Promise<void> {
    const items = readStorage().filter((item) => item.id !== id);
    writeStorage(items);
  },

  async clear(): Promise<void> {
    writeStorage([]);
  },
};
