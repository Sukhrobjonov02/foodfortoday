import { useState, useEffect } from 'react';
import type { FoodItem } from '../types';
import { mockDb } from '../db/mockDb';

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockDb.getAll().then((items) => {
      setFoods(items);
      setIsLoading(false);
    });
  }, []);

  const addFood = async (name: string) => {
    const newItem = await mockDb.add(name);
    setFoods((prev) => [...prev, newItem]);
  };

  const removeFood = async (id: string) => {
    await mockDb.remove(id);
    setFoods((prev) => prev.filter((item) => item.id !== id));
  };

  const updateFood = async (id: string, name: string) => {
    const updated = await mockDb.update(id, name);
    setFoods((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  return { foods, isLoading, addFood, removeFood, updateFood };
}
