import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import type { Tab } from './types';
import { useFoods } from './hooks/useFoods';
import { useTelegramViewport } from './hooks/useTelegramViewport';
import { Layout } from './components/Layout';
import { TabBar } from './components/TabBar';
import { FoodList } from './components/FoodList/FoodList';
import { Composer } from './components/FoodList/Composer';
import { SpinWheel } from './components/SpinWheel/SpinWheel';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('foods');
  const { foods, isLoading, addFood, removeFood, updateFood } = useFoods();

  useTelegramViewport();

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

  const existingNames = foods.map((f) => f.name);

  return (
    <Layout
      activeTab={activeTab}
      bottomDock={
        <>
          {activeTab === 'foods' && (
            <Composer onAdd={addFood} existingNames={existingNames} />
          )}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      }
    >
      {activeTab === 'foods' ? (
        <FoodList foods={foods} onRemove={removeFood} onUpdate={updateFood} />
      ) : (
        <SpinWheel foods={foods} />
      )}
    </Layout>
  );
}

export default App;
