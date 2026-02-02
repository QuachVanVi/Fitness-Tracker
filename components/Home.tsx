
import React from 'react';
import { Calendar, Bell, Plus, ChevronRight, Droplets, Camera, Flame, Star } from 'lucide-react';
import { User, LoggedMeal } from '../types';

interface Props {
  user: User | null;
  logs: LoggedMeal[];
  waterIntake: number;
  setWaterIntake: (val: number) => void;
  onOpenScan: () => void;
  onLogMeal: () => void;
}

const formatNum = (num: number) => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const Home: React.FC<Props> = ({ user, logs, waterIntake, setWaterIntake, onOpenScan, onLogMeal }) => {
  if (!user) return null;
  
  const eaten = logs.reduce((sum, l) => sum + l.calories, 0);
  const goal = user?.dailyCalories || 2400; 
  const remaining = Math.max(0, goal - eaten);
  const burned = 450; 

  const macros = logs.reduce((acc, l) => ({
    carbs: acc.carbs + l.carbs,
    protein: acc.protein + l.protein,
    fat: acc.fat + l.fat
  }), { carbs: 0, protein: 0, fat: 0 });

  const categoriesLogged = {
    Breakfast: logs.some(l => l.category === 'Breakfast'),
    Lunch: logs.some(l => l.category === 'Lunch'),
    Dinner: logs.some(l => l.category === 'Dinner'),
    Snack: logs.some(l => l.category === 'Snack'),
  };

  const percentage = Math.min(100, (eaten / goal) * 100);
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  // Gamification: XP progress
  const xpPercent = (user.xp / user.xpNextLevel) * 100;

  return (
    <div className="flex flex-col text-white pb-32">
      {/* XP PROGRESS BAR - Top Sticky */}
      <div className="px-6 pt-4 mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-lime-400 flex items-center justify-center text-black shadow-[0_0_10px_rgba(163,230,53,0.4)]">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">Level {user.level}</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{user.xp} / {user.xpNextLevel} EXP</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className="h-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)] transition-all duration-700 ease-out" 
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="p-6 pt-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#121212] flex items-center justify-center text-green-500 border border-zinc-800">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold">Today</h2>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Wed, Oct 18</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenScan} className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center border border-zinc-800 text-lime-400 hover:bg-zinc-800 transition-colors">
            <Camera size={20} />
          </button>
          <div className="relative cursor-pointer">
            <Bell size={24} className="text-zinc-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></span>
          </div>
        </div>
      </header>

      {/* Main Calorie Circle */}
      <div className="relative w-full max-w-[280px] aspect-square mx-auto my-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#00FF66]/5 blur-[60px] rounded-full -z-10 scale-90"></div>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} stroke="#121212" strokeWidth="10" fill="transparent" />
          <circle 
            cx="100" cy="100" r={radius} stroke="#00FF66" strokeWidth="10" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 6px rgba(0, 255, 102, 0.7))' }}
          />
        </svg>
        <div className="flex flex-col items-center justify-center text-center z-10 p-4">
          <div className="mb-1">
             <div className="p-2 rounded-full bg-[#00FF66]/10 shadow-[0_0_20px_rgba(0,255,102,0.15)] flex items-center justify-center">
                <Flame size={28} className="text-[#00FF66]" fill="#00FF66" fillOpacity={0.2} />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl xs:text-6xl font-black tracking-tighter leading-none mb-1">{formatNum(eaten)}</span>
            <span className="text-zinc-500 font-bold text-xs tracking-widest opacity-80 uppercase">kcal intake</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-6 mb-8">
        <Stat label="REMAINING" value={remaining} color="text-green-500" />
        <Stat label="GOAL" value={goal} color="text-white" />
        <Stat label="BURNED" value={burned} color="text-zinc-500" />
      </div>

      <div className="h-[1px] bg-zinc-900/50 mx-8 mb-8"></div>

      <div className="flex justify-between px-6 mb-8 overflow-x-auto no-scrollbar">
        <MealTab label="Breakfast" active={categoriesLogged.Breakfast} />
        <MealTab label="Lunch" active={categoriesLogged.Lunch} />
        <MealTab label="Dinner" active={categoriesLogged.Dinner} />
        <MealTab label="Snack" active={categoriesLogged.Snack} />
      </div>

      <div className="flex gap-4 px-6 overflow-x-auto pb-6 no-scrollbar mb-4">
        <MacroCard label="Carbs" value={macros.carbs} total={240} color="bg-blue-500" icon="💠" />
        <MacroCard label="Protein" value={macros.protein} total={user?.proteinGoal || 150} color="bg-green-500" icon="🍃" />
        <MacroCard label="Fat" value={macros.fat} total={60} color="bg-orange-500" icon="💧" />
      </div>

      <section className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold">Water Intake</h3>
          <button onClick={() => setWaterIntake(Math.min(2500, waterIntake + 250))} className="text-blue-500 text-xs font-bold active:scale-95 transition-transform uppercase tracking-wider">Add Glass</button>
        </div>
        <div className="bg-[#121212] rounded-3xl p-5 border border-zinc-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Droplets size={20} />
              </div>
              <div>
                <h4 className="font-bold text-md">{formatNum(waterIntake)} ml</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Goal: 2.5L</p>
              </div>
            </div>
            <span className="text-2xl font-black text-blue-500/40">{(waterIntake / 2500 * 100).toFixed(0)}%</span>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                onClick={() => setWaterIntake(Math.min(2500, (i + 1) * 500))}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${waterIntake >= (i + 1) * 500 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-[#1a1a1a] text-zinc-600 border border-zinc-800'}`}
              >
                <Droplets size={16} fill={waterIntake >= (i + 1) * 500 ? "currentColor" : "none"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6">
        <h3 className="text-lg font-bold mb-4">Today's Meals</h3>
        <div className="space-y-4">
          {logs.length > 0 ? logs.map(meal => (
            <div key={meal.id} className="bg-[#121212] p-4 rounded-3xl border border-zinc-800/50 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 shrink-0">
                <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop`} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-bold text-zinc-100 truncate text-sm">{meal.name}</h4>
                  <span className="text-[#00FF66] font-black text-xs shrink-0">{formatNum(meal.calories)} kcal</span>
                </div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2">{meal.category} • {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex gap-2">
                  <span className="bg-[#1a1a1a] px-2 py-0.5 rounded-lg text-[9px] text-zinc-400 font-bold tracking-tight">{formatNum(meal.carbs)}g Carbs</span>
                  <span className="bg-[#1a1a1a] px-2 py-0.5 rounded-lg text-[9px] text-zinc-400 font-bold tracking-tight">{formatNum(meal.protein)}g Prot</span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-zinc-500 text-xs text-center py-6 italic opacity-50">Log your first meal to see it here.</p>
          )}

          <button 
            onClick={onLogMeal}
            className="w-full bg-[#0a0a0a] border-2 border-dashed border-zinc-800/50 py-5 rounded-3xl flex items-center justify-center gap-3 text-zinc-500 font-bold hover:bg-zinc-900/30 transition-all active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <Plus size={16} />
            </div>
            <span className="text-sm">Log Next Meal</span>
          </button>
        </div>
      </section>
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase mb-1">{label}</span>
    <span className={`text-xl font-black ${color}`}>{formatNum(value)}</span>
  </div>
);

const MealTab = ({ label, active }: { label: string, active?: boolean }) => (
  <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-800'}`}></div>
    <span className={`text-[10px] font-bold transition-colors duration-300 uppercase tracking-tighter ${active ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
  </div>
);

const MacroCard = ({ label, value, total, color, icon }: { label: string, value: number, total: number, color: string, icon: string }) => {
  const percent = Math.min(100, (value / total) * 100);
  return (
    <div className="bg-[#121212] min-w-[135px] rounded-3xl p-4 border border-zinc-800/50">
      <div className="flex justify-between items-start mb-4">
        <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-md">{icon}</div>
        <span className="text-[9px] text-zinc-500 font-bold uppercase">{(100 - percent).toFixed(0)}% Left</span>
      </div>
      <h4 className="text-zinc-500 text-[9px] font-bold mb-1 uppercase tracking-wider">{label}</h4>
      <h3 className="text-xl font-black mb-3">{formatNum(value)}g</h3>
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500 ease-out`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default Home;
