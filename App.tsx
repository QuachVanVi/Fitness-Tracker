import React, { useState, useEffect, useCallback } from 'react';
import { AppView, User, LoggedMeal, FoodItem, CustomMeal } from './types';
import Home from './components/Home';
import Trends from './components/Trends';
import LogMeal from './components/LogMeal';
import FoodDetails from './components/FoodDetails';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import BodyScan from './components/BodyScan';
import FoodScan from './components/FoodScan';
import { Trophy, Star, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LoggedMeal[]>([]);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [waterIntake, setWaterIntake] = useState(1250);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [forceBuilder, setForceBuilder] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fit_user');
    const savedLogs = localStorage.getItem('fit_logs');
    const savedCustomMeals = localStorage.getItem('fit_custom_meals');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.HOME);
    }
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedCustomMeals) setCustomMeals(JSON.parse(savedCustomMeals));
  }, []);

  const triggerXpToast = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3000);
  };

  const checkLevelUp = useCallback((updatedUser: User) => {
    let u = { ...updatedUser };
    let leveled = false;
    while (u.xp >= u.xpNextLevel) {
      u.xp -= u.xpNextLevel;
      u.level += 1;
      u.xpNextLevel = u.level * 500;
      leveled = true;
    }
    if (leveled) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 5000);
    }
    return u;
  }, []);

  const awardXp = useCallback((amount: number, type: 'protein' | 'water' | 'calories') => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily awards if date changed
    let u = { ...user };
    if (u.lastAwardedDate !== today) {
      u.lastAwardedDate = today;
      u.awardsClaimed = { protein: false, water: false, calories: false };
    }

    if (u.awardsClaimed[type]) return;

    u.xp += amount;
    u.awardsClaimed[type] = true;
    u = checkLevelUp(u);
    
    setUser(u);
    localStorage.setItem('fit_user', JSON.stringify(u));
    triggerXpToast(`+${amount} EXP: ${type.toUpperCase()} GOAL MET!`);
  }, [user, checkLevelUp]);

  // Monitor goals for EXP
  useEffect(() => {
    if (!user) return;
    
    // Check Water (2.5L goal)
    if (waterIntake >= 2500 && !user.awardsClaimed.water) {
      awardXp(50, 'water');
    }

    // Check Protein
    const totalProtein = logs.reduce((sum, l) => sum + l.protein, 0);
    if (totalProtein >= user.proteinGoal && !user.awardsClaimed.protein) {
      awardXp(100, 'protein');
    }

    // Check Calories
    const totalCals = logs.reduce((sum, l) => sum + l.calories, 0);
    if (totalCals >= user.dailyCalories * 0.8 && totalCals <= user.dailyCalories && !user.awardsClaimed.calories) {
      awardXp(150, 'calories');
    }
  }, [logs, waterIntake, user, awardXp]);

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

  const handleLogCustomMeal = (meal: CustomMeal, category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
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
      category: category 
    };
    addLog(log);
  };

  const handleFabClick = () => {
    setForceBuilder(true);
    setCurrentView(AppView.LOG);
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
            onLogMeal={() => {
              setForceBuilder(false);
              setCurrentView(AppView.LOG);
            }}
          />
        );
      case AppView.LOG:
        return (
          <LogMeal 
            customMeals={customMeals}
            forceBuilder={forceBuilder}
            onSelectFood={(food) => {
              setSelectedFood(food);
              setCurrentView(AppView.DETAILS);
            }} 
            onSaveCustomMeal={handleSaveCustomMeal}
            onDeleteCustomMeal={handleDeleteCustomMeal}
            onLogCustomMeal={handleLogCustomMeal}
            onBack={() => {
              setForceBuilder(false);
              setCurrentView(AppView.HOME);
            }}
            onBuilderToggle={(isOpen) => {
              setIsBuilderOpen(isOpen);
              if (!isOpen) setForceBuilder(false);
            }}
            onOpenScan={() => setCurrentView(AppView.FOOD_SCAN)}
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
      case AppView.FOOD_SCAN:
        return <FoodScan onAdd={addLog} onBack={() => setCurrentView(AppView.LOG)} />;
      default:
        return (
          <Home 
            user={user} 
            logs={logs} 
            waterIntake={waterIntake} 
            setWaterIntake={setWaterIntake} 
            onOpenScan={() => setCurrentView(AppView.SCAN)}
            onLogMeal={() => {
              setForceBuilder(false);
              setCurrentView(AppView.LOG);
            }}
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto h-full w-full bg-black flex flex-col relative overflow-hidden md:border-x md:border-zinc-900">
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-safe">
        {renderView()}
      </main>
      
      {xpToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-lime-400 text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-lime-500/30 z-[300] flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Star size={14} fill="currentColor" /> {xpToast}
        </div>
      )}

      {showLevelUp && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#121212] border border-lime-500/50 rounded-[40px] p-10 w-full max-w-xs text-center shadow-[0_0_50px_rgba(163,230,53,0.3)] animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-lime-400 rounded-full mx-auto mb-6 flex items-center justify-center text-black shadow-2xl animate-bounce">
              <Trophy size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Level Up!</h2>
            <p className="text-zinc-500 text-sm font-bold mb-6">You've reached Level <span className="text-lime-400">{user?.level}</span></p>
            <div className="flex justify-center gap-2">
              <Sparkles className="text-lime-400" />
              <p className="text-lime-400 font-black uppercase tracking-widest text-[10px]">New Goal Unlocked</p>
              <Sparkles className="text-lime-400" />
            </div>
            <button 
              onClick={() => setShowLevelUp(false)}
              className="mt-8 w-full bg-lime-400 text-black py-4 rounded-2xl font-black uppercase tracking-wider text-sm active:scale-95 transition-all"
            >
              Keep Going
            </button>
          </div>
        </div>
      )}
      
      {currentView !== AppView.AUTH && currentView !== AppView.DETAILS && currentView !== AppView.SCAN && currentView !== AppView.FOOD_SCAN && !isBuilderOpen && (
        <Navigation 
          currentView={currentView} 
          setView={(v) => {
            setForceBuilder(false);
            setCurrentView(v);
          }} 
          onFabClick={handleFabClick}
        />
      )}
    </div>
  );
};

export default App;