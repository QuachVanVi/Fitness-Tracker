
import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Flame, Info, Check } from 'lucide-react';
import { FoodItem, LoggedMeal } from '../types';

interface Props {
  food: FoodItem;
  onAdd: (meal: LoggedMeal) => void;
  onBack: () => void;
}

// Helper to ensure max 2 decimals
const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const FoodDetails: React.FC<Props> = ({ food, onAdd, onBack }) => {
  const [portion, setPortion] = useState(1.0);

  const calculate = (val: number) => roundToTwo(val * portion);

  const handleAdd = () => {
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.name,
      calories: Math.round(food.calories * portion), // Calories usually integer
      carbs: calculate(food.carbs),
      protein: calculate(food.protein),
      fat: calculate(food.fat),
      portion,
      timestamp: Date.now(),
      category: food.category
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pb-32">
      <div className="relative w-full aspect-[4/3] xs:aspect-[16/10] overflow-hidden">
        <img src={food.image} className="w-full h-full object-cover" alt={food.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft size={20}/>
          </button>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform">
            <Bookmark size={20}/>
          </button>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10 flex-1 flex flex-col bg-[#0a0a0a] rounded-t-[32px] pt-8">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl xs:text-3xl font-bold text-white pr-4 leading-tight">{food.name}</h1>
          <div className="bg-lime-900/30 text-lime-400 px-3 py-1 rounded-full text-xs font-black border border-lime-800/30 flex items-center gap-1 shrink-0 mt-1 uppercase tracking-tighter">
            <Flame size={12} fill="currentColor" /> {Math.round(food.calories * portion)} kcal
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">{food.calories} kcal/serving • {food.category}</p>

        {/* Macro Circles - Smaller for mobile */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <MacroCircle label="Carbs" value={calculate(food.carbs)} percent={roundToTwo((food.carbs * 4 / food.calories) * 100)} color="border-blue-500" />
          <MacroCircle label="Protein" value={calculate(food.protein)} percent={roundToTwo((food.protein * 4 / food.calories) * 100)} color="border-lime-500" />
          <MacroCircle label="Fat" value={calculate(food.fat)} percent={roundToTwo((food.fat * 9 / food.calories) * 100)} color="border-orange-500" />
        </div>

        {/* Portion Slider */}
        <div className="bg-[#121212] p-5 rounded-3xl mb-8 border border-zinc-800/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-md">Portion Size</h3>
            <span className="bg-lime-400 text-black px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
              {portion.toFixed(1)}x serving
            </span>
          </div>
          <div className="px-2">
            <input 
              type="range" 
              min="0.5" 
              max="3.0" 
              step="0.1" 
              value={portion}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
            />
          </div>
          <div className="flex justify-between mt-3 px-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <span>0.5x</span>
            <span>1.5x</span>
            <span>3.0x</span>
          </div>
        </div>

        {/* Nutritional Facts */}
        <h3 className="text-lg font-bold mb-4">Nutritional Facts</h3>
        <div className="space-y-3">
          <FactItem icon="●" label="Fiber" value={`${(food.fiber * portion).toFixed(1)}g`} color="text-orange-500" />
          <FactItem icon="♥" label="Sugar" value={`${(food.sugar * portion).toFixed(1)}g`} color="text-pink-500" />
          <FactItem icon="☁" label="Sodium" value={`${roundToTwo(food.sodium * portion)}mg`} color="text-blue-400" />
          <FactItem icon="◈" label="Cholesterol" value={`${roundToTwo(food.cholesterol * portion)}mg`} color="text-purple-400" />
        </div>
      </div>

      {/* Sticky Bottom Button - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pt-12 max-w-md mx-auto pointer-events-none pb-safe">
        <div className="bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent absolute inset-0 -z-10 h-full"></div>
        <button 
          onClick={handleAdd}
          className="w-full bg-lime-400 text-black py-5 rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 pointer-events-auto active:scale-95 transition-all"
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
  <div className="bg-[#121212] rounded-3xl p-3 flex flex-col items-center border border-zinc-800/50">
    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center mb-2 ${color} border-opacity-20`}>
      <span className="text-[10px] font-black">{Math.min(100, Math.round(percent))}%</span>
    </div>
    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">{label}</span>
    <span className="font-black text-xs">{value}g</span>
  </div>
);

const FactItem = ({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-zinc-800/30">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-[10px] ${color}`}>
        {icon}
      </div>
      <span className="font-bold text-sm text-zinc-300">{label}</span>
    </div>
    <span className="font-black text-sm text-white">{value}</span>
  </div>
);

export default FoodDetails;
