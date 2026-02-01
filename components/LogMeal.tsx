
import React, { useState, useEffect } from 'react';
import { Search, Scan, Plus, ArrowLeft, X, Check, ChefHat, Trash2, Save, ShoppingBag, Filter } from 'lucide-react';
import { MOCK_FOODS } from '../constants';
import { FoodItem, CustomMeal, FoodGroup } from '../types';

interface Props {
  customMeals: CustomMeal[];
  onSelectFood: (food: FoodItem) => void;
  onSaveCustomMeal: (meal: CustomMeal) => void;
  onDeleteCustomMeal: (id: string) => void;
  onLogCustomMeal: (meal: CustomMeal) => void;
  onBack: () => void;
  onBuilderToggle?: (isOpen: boolean) => void;
}

const FOOD_GROUPS: (FoodGroup | 'All')[] = ['All', 'Meat', 'Vegetables', 'Carbs', 'Fruits', 'Dairy', 'Fats'];

const LogMeal: React.FC<Props> = ({ 
  customMeals, 
  onSelectFood, 
  onSaveCustomMeal, 
  onDeleteCustomMeal, 
  onLogCustomMeal, 
  onBack,
  onBuilderToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Recent');
  const [selectedGroup, setSelectedGroup] = useState<(FoodGroup | 'All')>('All');
  const [showBuilder, setShowBuilder] = useState(false);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  
  // Meal Builder State
  const [mealName, setMealName] = useState('');
  const [builderItems, setBuilderItems] = useState<FoodItem[]>([]);
  const [builderSearch, setBuilderSearch] = useState('');
  const [builderSelectedGroup, setBuilderSelectedGroup] = useState<(FoodGroup | 'All')>('All');

  // Sync builder status with parent to hide navigation
  useEffect(() => {
    onBuilderToggle?.(showBuilder);
  }, [showBuilder, onBuilderToggle]);

  const filterFoodList = (list: FoodItem[], query: string, group: FoodGroup | 'All') => {
    return list.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(query.toLowerCase());
      const matchesGroup = group === 'All' || f.group === group;
      return matchesSearch && matchesGroup;
    });
  };

  const filteredFoods = filterFoodList(MOCK_FOODS, searchQuery, selectedGroup);
  const builderFilteredFoods = filterFoodList(MOCK_FOODS, builderSearch, builderSelectedGroup);

  const builderTotals = builderItems.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleSaveMeal = () => {
    if (!mealName.trim() || builderItems.length === 0) {
      if (!mealName.trim()) alert('Please provide a name for your meal!');
      return;
    }
    
    const newMeal: CustomMeal = {
      id: Math.random().toString(36).substr(2, 9),
      name: mealName,
      calories: builderTotals.calories,
      protein: builderTotals.protein,
      carbs: builderTotals.carbs,
      fat: builderTotals.fat,
      items: builderItems.map(i => i.name)
    };
    
    onSaveCustomMeal(newMeal);
    setShowBuilder(false);
    setMealName('');
    setBuilderItems([]);
    setActiveTab('My Meals');
  };

  const handleLogClick = (meal: CustomMeal) => {
    setLoggingId(meal.id);
    setTimeout(() => {
      onLogCustomMeal(meal);
      setLoggingId(null);
    }, 600);
  };

  if (showBuilder) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 pb-2 sticky top-0 bg-[#050505] z-20">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowBuilder(false)} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h1 className="text-xl font-bold">Meal Builder</h1>
            <div className="w-10"></div>
          </div>
          <input 
            type="text"
            placeholder="Name your combo (e.g. 'Power Lunch')"
            className="w-full bg-[#121212] border border-zinc-800 rounded-2xl py-4 px-6 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-lime-500/30 mb-4"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
          />
          
          <div className="bg-lime-400/10 rounded-2xl p-4 border border-lime-400/20 grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Kcal</p>
              <p className="text-sm font-black text-white">{builderTotals.calories}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Prot</p>
              <p className="text-sm font-black text-lime-400">{builderTotals.protein}g</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Carb</p>
              <p className="text-sm font-black text-blue-400">{builderTotals.carbs}g</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Fat</p>
              <p className="text-sm font-black text-orange-400">{builderTotals.fat}g</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-40">
          <section>
            <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShoppingBag size={12} /> Ingredients List ({builderItems.length})
            </h2>
            <div className="space-y-3">
              {builderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#121212] p-3 rounded-2xl border border-zinc-900 group">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold">{item.calories} kcal • {item.protein}g P</p>
                    </div>
                  </div>
                  <button onClick={() => setBuilderItems(builderItems.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500 p-2 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {builderItems.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-zinc-900 rounded-[32px] text-zinc-700 bg-zinc-900/10">
                  <ChefHat size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Add items below to create combo</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Add to Meal</h2>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                placeholder="Search food database..."
                className="w-full bg-[#121212] rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                value={builderSearch}
                onChange={(e) => setBuilderSearch(e.target.value)}
              />
            </div>
            
            {/* Category Chips in Builder */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1 mb-2">
              {FOOD_GROUPS.map(group => (
                <button
                  key={group}
                  onClick={() => setBuilderSelectedGroup(group)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${
                    builderSelectedGroup === group 
                      ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]' 
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {builderFilteredFoods.slice(0, 10).map(food => (
                <button 
                  key={food.id}
                  onClick={() => {
                    setBuilderItems([...builderItems, food]);
                    setBuilderSearch('');
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-800/40 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800">
                      <img src={food.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">{food.name}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{food.group} • {food.calories} kcal</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-lime-400/10 flex items-center justify-center text-lime-400">
                    <Plus size={16} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 max-w-md mx-auto z-[110]">
          <button 
            onClick={handleSaveMeal}
            disabled={!mealName.trim() || builderItems.length === 0}
            className="w-full bg-lime-400 text-black py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-lime-500/20 disabled:opacity-20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Save size={20} /> Save to My Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <header className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-bold">Log Meal</h1>
          <button className="p-2 -mr-2 text-lime-400"><Scan size={24} /></button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search for food..."
            className="w-full bg-[#1a1a1a] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/30 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex border-b border-zinc-900 mb-4">
          {['Recent', 'Frequent', 'My Meals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-4 text-sm font-bold transition-all ${
                activeTab === tab ? 'text-lime-400 border-b-2 border-lime-400' : 'text-zinc-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab !== 'My Meals' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {FOOD_GROUPS.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${
                  selectedGroup === group 
                    ? 'bg-lime-400/10 text-lime-400 border-lime-400/40' 
                    : 'bg-zinc-900/50 text-zinc-600 border-zinc-800'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="flex-1 px-6 pt-2 overflow-y-auto pb-32">
        {activeTab === 'My Meals' ? (
          <div className="space-y-6">
            <button 
              onClick={() => setShowBuilder(true)}
              className="w-full bg-zinc-900/50 border-2 border-dashed border-lime-400/20 py-8 rounded-[32px] flex flex-col items-center gap-3 text-lime-400 font-bold active:scale-[0.98] transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-lime-400/10 flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                <ChefHat size={28} />
              </div>
              <div className="text-center">
                <p className="text-lg">Meal Builder</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Create custom combo</p>
              </div>
            </button>
            
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Saved Library ({customMeals.length})</h2>
            </div>
            
            <div className="space-y-4">
              {customMeals.length > 0 ? customMeals.map(meal => (
                <div 
                  key={meal.id}
                  className={`bg-[#121212] p-5 rounded-[28px] border transition-all relative group overflow-hidden ${loggingId === meal.id ? 'border-lime-400 scale-[0.98]' : 'border-zinc-800/50'}`}
                >
                  <div 
                    onClick={() => handleLogClick(meal)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 pr-8">
                        <h3 className="text-xl font-bold group-hover:text-lime-400 transition-colors">{meal.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {meal.items.map((it, i) => (
                            <span key={i} className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-lg border border-zinc-800 font-bold uppercase">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-lime-400/10 px-3 py-1.5 rounded-2xl border border-lime-400/20 text-center min-w-[70px]">
                        <span className="text-lime-400 text-xs font-black block leading-none">{meal.calories}</span>
                        <span className="text-[8px] text-lime-400/60 font-bold uppercase">kcal</span>
                      </div>
                    </div>
                  </div>

                  {loggingId === meal.id && (
                    <div className="absolute inset-0 bg-lime-400 flex items-center justify-center z-10 animate-in fade-in zoom-in duration-300">
                      <div className="flex flex-col items-center text-black">
                        <Check size={40} strokeWidth={4} />
                        <span className="font-black text-lg uppercase tracking-widest">Logged</span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('Delete this template?')) onDeleteCustomMeal(meal.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )) : (
                <div className="py-20 text-center">
                  <ChefHat size={48} className="mx-auto mb-4 text-zinc-800" />
                  <p className="text-zinc-500 font-medium italic">Your library is empty.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Database</h2>
            {filteredFoods.map(food => (
              <div 
                key={food.id} 
                className="flex items-center gap-4 p-3 -mx-2 hover:bg-zinc-900/50 rounded-[24px] transition-colors cursor-pointer group"
                onClick={() => onSelectFood(food)}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800 bg-zinc-900">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-lime-400 transition-colors">{food.name}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500 font-bold uppercase tracking-tighter">{food.group}</span>
                  </div>
                  <p className="text-zinc-500 text-xs font-bold mt-1">{food.calories} kcal • {food.protein}g P</p>
                </div>
                <button className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-lime-500 group-hover:text-black transition-all">
                  <Plus size={24} />
                </button>
              </div>
            ))}
            {filteredFoods.length === 0 && (
              <div className="py-20 text-center text-zinc-600 italic">
                No foods found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogMeal;
