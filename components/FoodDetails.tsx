
import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Flame, Info, Check } from 'lucide-react';
import { FoodItem, LoggedMeal } from '../types';

interface Props {
  food: FoodItem;
  onAdd: (meal: LoggedMeal) => void;
  onBack: () => void;
}

const FoodDetails: React.FC<Props> = ({ food, onAdd, onBack }) => {
  const [portion, setPortion] = useState(1.0);

  const calculate = (val: number) => Math.round(val * portion);

  const handleAdd = () => {
    // FIX: Added missing 'category' property to satisfy the LoggedMeal interface requirement.
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.name,
      calories: calculate(food.calories),
      carbs: calculate(food.carbs),
      protein: calculate(food.protein),
      fat: calculate(food.fat),
      portion,
      timestamp: Date.now(),
      category: food.category
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="relative h-80">
        <img src={food.image} className="w-full h-full object-cover" alt={food.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white"><ArrowLeft size={20}/></button>
          <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white"><Bookmark size={20}/></button>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-10 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold text-white pr-4">{food.name}</h1>
          <div className="bg-lime-900/30 text-lime-400 px-3 py-1 rounded-full text-xs font-bold border border-lime-800/50 flex items-center gap-1 mt-2">
            <Flame size={12} fill="currentColor" /> {calculate(food.calories)}
          </div>
        </div>
        <p className="text-zinc-500 mb-8">{food.calories} kcal per serving • {food.category}</p>

        {/* Macro Circles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <MacroCircle label="Carbs" value={45} percent={55} color="border-blue-500" />
          <MacroCircle label="Protein" value={12} percent={30} color="border-lime-500" />
          <MacroCircle label="Fat" value={18} percent={15} color="border-orange-500" />
        </div>

        {/* Portion Slider */}
        <div className="bg-[#1a1a1a] p-6 rounded-3xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Portion Size</h3>
            <span className="bg-lime-900/40 text-lime-400 px-3 py-1 rounded-full text-sm font-bold border border-lime-800/30">
              {portion.toFixed(1)} serving
            </span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={portion}
            onChange={(e) => setPortion(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
          />
          <div className="flex justify-between mt-3 text-[10px] text-zinc-500 font-bold uppercase">
            <span>0.5</span>
            <span>2.0</span>
          </div>
        </div>

        {/* Nutritional Facts */}
        <h3 className="text-xl font-bold mb-4">Nutritional Facts</h3>
        <div className="space-y-4 mb-32">
          <FactItem icon="●" label="Fiber" value={`${(food.fiber * portion).toFixed(1)}g`} color="text-orange-500" />
          <FactItem icon="♥" label="Sugar" value={`${(food.sugar * portion).toFixed(1)}g`} color="text-pink-500" />
          <FactItem icon="☁" label="Sodium" value={`${Math.round(food.sodium * portion)}mg`} color="text-blue-400" />
          <FactItem icon="◈" label="Cholesterol" value={`${Math.round(food.cholesterol * portion)}mg`} color="text-purple-400" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] pt-12 max-w-md mx-auto pointer-events-none">
        <button 
          onClick={handleAdd}
          className="w-full bg-lime-400 text-black py-5 rounded-3xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.98] transition-all"
        >
          <PlusCircle size={24} /> Add to Diary
        </button>
      </div>
    </div>
  );
};

const PlusCircle = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const MacroCircle = ({ label, value, percent, color }: { label: string, value: number, percent: number, color: string }) => (
  <div className="bg-[#1a1a1a] rounded-3xl p-4 flex flex-col items-center border border-zinc-900">
    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center mb-3 ${color} border-opacity-20`}>
      <span className="text-[12px] font-bold">{percent}%</span>
    </div>
    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{label}</span>
    <span className="font-bold text-sm">{value}g</span>
  </div>
);

const FactItem = ({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-2xl border border-zinc-900/50">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 ${color}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
    <span className="font-bold">{value}</span>
  </div>
);

export default FoodDetails;
