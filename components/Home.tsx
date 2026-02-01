
import React from 'react';
import { Calendar, Bell, Plus, ChevronRight, Droplets, Camera, Flame } from 'lucide-react';
import { User, LoggedMeal } from '../types';

interface Props {
  user: User | null;
  logs: LoggedMeal[];
  waterIntake: number;
  setWaterIntake: (val: number) => void;
  onOpenScan: () => void;
}

const formatNum = (num: number) => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const Home: React.FC<Props> = ({ user, logs, waterIntake, setWaterIntake, onOpenScan }) => {
  const eaten = logs.reduce((sum, l) => sum + l.calories, 0);
  const goal = user?.dailyCalories || 2400; 
  const remaining = Math.max(0, goal - eaten);
  const burned = 450; // Mock burned value

  const macros = logs.reduce((acc, l) => ({
    carbs: acc.carbs + l.carbs,
    protein: acc.protein + l.protein,
    fat: acc.fat + l.fat
  }), { carbs: 0, protein: 0, fat: 0 });

  // Calculate percentage for circular progress
  const percentage = Math.min(100, (eaten / goal) * 100);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="flex flex-col text-white pb-10">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
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
      <div className="relative w-80 h-80 mx-auto my-4 flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#00FF66]/5 blur-[80px] rounded-full -z-10 scale-90"></div>
        
        {/* Progress SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            stroke="#121212" 
            strokeWidth="12" 
            fill="transparent" 
          />
          {/* Neon Progress bar */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            stroke="#00FF66" 
            strokeWidth="12" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 0 6px rgba(0, 255, 102, 0.7))'
            }}
          />
        </svg>

        {/* CENTERED CONTENT - Precise layout adjustment */}
        <div className="flex flex-col items-center justify-center text-center z-10 pt-2">
          <div className="mb-2">
             {/* Neon Fire Icon Replacement */}
             <div className="p-2 rounded-full bg-[#00FF66]/10 shadow-[0_0_20px_rgba(0,255,102,0.15)] flex items-center justify-center">
                <Flame size={32} className="text-[#00FF66]" fill="#00FF66" fillOpacity={0.2} />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-7xl font-black tracking-tighter leading-none mb-1">{formatNum(eaten)}</span>
            <span className="text-zinc-500 font-bold text-sm tracking-widest opacity-80">/ {formatNum(goal)} kcal</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 px-8 mb-8">
        <Stat label="EATEN" value={eaten} color="text-white" />
        <Stat label="REMAINING" value={remaining} color="text-green-500" />
        <Stat label="BURNED" value={burned} color="text-zinc-400" />
      </div>

      <div className="h-[1px] bg-zinc-900/50 mx-8 mb-8"></div>

      {/* Meal Tabs */}
      <div className="flex justify-between px-10 mb-8">
        <MealTab label="Breakfast" active count={1} />
        <MealTab label="Lunch" active count={1} />
        <MealTab label="Dinner" />
        <MealTab label="Snack" />
      </div>

      {/* Macro Cards */}
      <div className="flex gap-4 px-6 overflow-x-auto pb-6 no-scrollbar mb-4">
        <MacroCard label="Carbs" value={macros.carbs} total={240} color="bg-blue-500" icon="💠" />
        <MacroCard label="Protein" value={macros.protein} total={user?.proteinGoal || 150} color="bg-green-500" icon="🍃" />
        <MacroCard label="Fat" value={macros.fat} total={60} color="bg-orange-500" icon="💧" />
      </div>

      {/* Water Intake */}
      <section className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold">Water Intake</h3>
          <button onClick={() => setWaterIntake(Math.min(2500, waterIntake + 250))} className="text-blue-500 text-sm font-bold active:scale-95 transition-transform">Add Water</button>
        </div>
        <div className="bg-[#121212] rounded-3xl p-6 border border-zinc-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{formatNum(waterIntake)} ml</h4>
                <p className="text-xs text-zinc-500 font-medium">Daily Goal: 2,500 ml</p>
              </div>
            </div>
            <span className="text-3xl font-black text-blue-500/40">{(waterIntake / 2500 * 100).toFixed(2)}%</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                onClick={() => setWaterIntake(Math.min(2500, (i + 1) * 500))}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${waterIntake >= (i + 1) * 500 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-[#1a1a1a] text-zinc-600 border border-zinc-800'}`}
              >
                <Droplets size={18} fill={waterIntake >= (i + 1) * 500 ? "currentColor" : "none"} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-1">
             <span className="text-[10px] text-zinc-500 font-bold">0ML</span>
             <span className="text-[10px] text-zinc-500 font-bold">1250ML</span>
             <span className="text-[10px] text-zinc-500 font-bold">2500ML</span>
          </div>
        </div>
      </section>

      {/* Today's Meals */}
      <section className="px-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Today's Meals</h3>
        <div className="space-y-4">
          {logs.length > 0 ? logs.map(meal => (
            <div key={meal.id} className="bg-[#121212] p-4 rounded-3xl border border-zinc-800/50 flex items-center gap-4 hover:bg-zinc-900 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800">
                <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop`} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-zinc-100">{meal.name}</h4>
                  <span className="text-[#00FF66] font-black text-sm">{formatNum(meal.calories)} kcal</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">{meal.category} • {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex gap-2">
                  <span className="bg-[#1a1a1a] px-2 py-0.5 rounded-lg text-[10px] text-zinc-400 font-bold">{formatNum(meal.carbs)}g Carbs</span>
                  <span className="bg-[#1a1a1a] px-2 py-0.5 rounded-lg text-[10px] text-zinc-400 font-bold">{formatNum(meal.protein)}g Protein</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-600" />
            </div>
          )) : (
            <p className="text-zinc-500 text-sm text-center py-4 italic">No meals logged yet today.</p>
          )}

          {/* Log Button */}
          <button className="w-full bg-[#0a0a0a] border-2 border-dashed border-zinc-800/50 py-6 rounded-3xl flex items-center justify-center gap-3 text-zinc-400 font-bold hover:bg-zinc-900/30 transition-all active:scale-[0.99]">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <Plus size={18} />
            </div>
            Log Your Next Meal
          </button>
        </div>
      </section>
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-1">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{formatNum(value)}</span>
  </div>
);

const MealTab = ({ label, active, count }: { label: string, active?: boolean, count?: number }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-800'}`}></div>
    <span className={`text-xs font-bold transition-colors duration-300 ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</span>
  </div>
);

const MacroCard = ({ label, value, total, color, icon }: { label: string, value: number, total: number, color: string, icon: string }) => {
  const percent = Math.min(100, (value / total) * 100);
  const left = Math.max(0, 100 - percent);
  return (
    <div className="bg-[#121212] min-w-[145px] rounded-3xl p-5 border border-zinc-800/50">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg">{icon}</div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{formatNum(left)}% Left</span>
      </div>
      <h4 className="text-zinc-500 text-[10px] font-bold mb-1 uppercase tracking-widest">{label}</h4>
      <h3 className="text-2xl font-black mb-3">{formatNum(value)}g</h3>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500 ease-out`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default Home;
