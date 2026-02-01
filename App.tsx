
import React, { useState, useEffect } from 'react';
import { AppView, User, LoggedMeal, FoodItem, CustomMeal } from './types';
import Home from './components/Home';
import Trends from './components/Trends';
import LogMeal from './components/LogMeal';
import FoodDetails from './components/FoodDetails';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import BodyScan from './components/BodyScan';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LoggedMeal[]>([]);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [waterIntake, setWaterIntake] = useState(1250);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fit_user');
    const savedLogs = localStorage.getItem('fit_logs');
    const savedCustomMeals = localStorage.getItem('fit_custom_meals');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.HOME);
    }
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    if (savedCustomMeals) {
      setCustomMeals(JSON.parse(savedCustomMeals));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('fit_user', JSON.stringify(userData));
    setCurrentView(AppView.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fit_user');
    setCurrentView(AppView.AUTH);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fit_user', JSON.stringify(updatedUser));
  };

  const addLog = (meal: LoggedMeal) => {
    const newLogs = [...logs, meal];
    setLogs(newLogs);
    localStorage.setItem('fit_logs', JSON.stringify(newLogs));
    setCurrentView(AppView.HOME);
  };

  const handleSaveCustomMeal = (meal: CustomMeal) => {
    const newCustomMeals = [...customMeals, meal];
    setCustomMeals(newCustomMeals);
    localStorage.setItem('fit_custom_meals', JSON.stringify(newCustomMeals));
  };

  const handleDeleteCustomMeal = (id: string) => {
    const newCustomMeals = customMeals.filter(m => m.id !== id);
    setCustomMeals(newCustomMeals);
    localStorage.setItem('fit_custom_meals', JSON.stringify(newCustomMeals));
  };

  const handleLogCustomMeal = (meal: CustomMeal) => {
    const log: LoggedMeal = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: meal.id,
      name: meal.name,
      calories: meal.calories,
      carbs: meal.carbs,
      protein: meal.protein,
      fat: meal.fat,
      portion: 1,
      timestamp: Date.now(),
      category: 'Lunch' 
    };
    addLog(log);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.AUTH:
        return <Auth onLogin={handleLogin} />;
      case AppView.HOME:
        return (
          <Home 
            user={user} 
            logs={logs} 
            waterIntake={waterIntake} 
            setWaterIntake={setWaterIntake}
            onOpenScan={() => setCurrentView(AppView.SCAN)}
          />
        );
      case AppView.LOG:
        return (
          <LogMeal 
            customMeals={customMeals}
            onSelectFood={(food) => {
              setSelectedFood(food);
              setCurrentView(AppView.DETAILS);
            }} 
            onSaveCustomMeal={handleSaveCustomMeal}
            onDeleteCustomMeal={handleDeleteCustomMeal}
            onLogCustomMeal={handleLogCustomMeal}
            onBack={() => setCurrentView(AppView.HOME)}
            onBuilderToggle={setIsBuilderOpen}
          />
        );
      case AppView.DETAILS:
        return selectedFood ? (
          <FoodDetails 
            food={selectedFood} 
            onAdd={addLog} 
            onBack={() => setCurrentView(AppView.LOG)} 
          />
        ) : null;
      case AppView.REPORTS:
        return <Trends user={user} logs={logs} />;
      case AppView.PROFILE:
        return (
          <Profile 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
            onBack={() => setCurrentView(AppView.HOME)} 
          />
        );
      case AppView.SCAN:
        return <BodyScan user={user} onBack={() => setCurrentView(AppView.HOME)} />;
      default:
        return <Home user={user} logs={logs} waterIntake={waterIntake} setWaterIntake={setWaterIntake} onOpenScan={() => setCurrentView(AppView.SCAN)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#050505] flex flex-col pb-[env(safe-area-inset-bottom,24px)] relative shadow-2xl overflow-hidden border-x border-zinc-900">
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
      
      {currentView !== AppView.AUTH && currentView !== AppView.DETAILS && currentView !== AppView.SCAN && !isBuilderOpen && (
        <Navigation 
          currentView={currentView} 
          setView={setCurrentView} 
        />
      )}
    </div>
  );
};

export default App;
