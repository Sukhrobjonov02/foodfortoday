import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import type { Tab } from './types';
import { useFoods } from './hooks/useFoods';
import { Layout } from './components/Layout';
import { TabBar } from './components/TabBar';
import { FoodList } from './components/FoodList/FoodList';
import { SpinWheel } from './components/SpinWheel/SpinWheel';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('foods');
  const { foods, isLoading, addFood, removeFood, updateFood } = useFoods();

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
    } catch {}
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab}>
      {activeTab === 'foods' ? (
        <FoodList foods={foods} onAdd={addFood} onRemove={removeFood} onUpdate={updateFood} />
      ) : (
        <SpinWheel foods={foods} />
      )}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </Layout>
  );
}

export default App;
