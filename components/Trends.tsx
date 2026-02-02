
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell
} from 'recharts';
import { User, LoggedMeal } from '../types';
import { MOCK_WEIGHT_HISTORY, MOCK_CALORIE_INTAKE } from '../constants';
import { Trophy, Flame, Zap, MoreHorizontal, ArrowLeft } from 'lucide-react';

interface Props {
  user: User | null;
  logs: LoggedMeal[];
}

const Trends: React.FC<Props> = ({ user, logs }) => {
  const weightLabel = user?.units === 'Imperial' ? 'lbs' : 'kg';
  const displayWeight = user?.currentWeight || 155;

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-8">
        <button className="p-2"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold">Your Progress Trends</h1>
        <button className="p-2"><MoreHorizontal size={24} /></button>
      </header>

      {/* Time Tabs */}
      <div className="flex bg-zinc-900 rounded-xl p-1 mb-8">
        <button className="flex-1 py-2 rounded-lg bg-zinc-800 text-sm font-medium">Week</button>
        <button className="flex-1 py-2 rounded-lg text-zinc-500 text-sm font-medium">Month</button>
        <button className="flex-1 py-2 rounded-lg text-zinc-500 text-sm font-medium">Year</button>
      </div>

      {/* Weight History Card */}
      <div className="bg-[#121212] rounded-3xl p-6 mb-6 border border-zinc-900">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Weight History</h2>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">{displayWeight}</span>
              <span className="text-zinc-500 font-medium">{weightLabel}</span>
            </div>
            <p className="text-zinc-500 text-[10px] mt-1">Last 7 Days vs Previous</p>
          </div>
          <div className="bg-red-950/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-900/50 flex items-center gap-1">
            <span className="text-[10px] transform rotate-180">▲</span> -1.2 {weightLabel}
          </div>
        </div>

        <div className="h-48 w-full mt-4">
          <ResponsiveContainer width="100%" height={192}>
            <AreaChart data={MOCK_WEIGHT_HISTORY}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#555', fontSize: 10}} 
                dy={10}
              />
              <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '8px', fontSize: '12px'}} />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#22d3ee" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calorie Intake Card */}
      <div className="bg-[#121212] rounded-3xl p-6 mb-8 border border-zinc-900">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Calorie Intake</h2>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">1,850</span>
              <span className="text-zinc-500 font-medium">kcal avg</span>
            </div>
            <p className="text-zinc-500 text-[10px] mt-1">Daily breakdown</p>
          </div>
          <div className="bg-green-950/30 text-lime-400 px-3 py-1 rounded-full text-xs font-bold border border-lime-900/50 flex items-center gap-1">
            <span>📈</span> +50 kcal
          </div>
        </div>

        <div className="h-48 w-full mt-4">
          <ResponsiveContainer width="100%" height={192}>
            <BarChart data={MOCK_CALORIE_INTAKE}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#555', fontSize: 10}} 
                dy={10}
              />
              <Bar dataKey="kcal" radius={[4, 4, 0, 0]}>
                {MOCK_CALORIE_INTAKE.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.highlight ? '#22d3ee' : '#3b82f6'} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestones */}
      <section>
        <h3 className="text-xl font-bold mb-6">Recent Milestones</h3>
        <div className="bg-[#121212] rounded-3xl p-6 border border-zinc-900 space-y-8 relative">
          {/* Timeline Line */}
          <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-zinc-800 -z-0"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-yellow-900/30 flex items-center justify-center border border-yellow-700/50">
              <Trophy size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="font-bold text-white">Hit Goal Weight</p>
              <p className="text-xs text-zinc-500">Yesterday</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center border border-orange-700/50">
              <Flame size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-white">Logged for 7 Days Straight</p>
              <p className="text-xs text-zinc-500">2 days ago</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-700/50">
              <Zap size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-white">Burned 3000 Calories</p>
              <p className="text-xs text-zinc-500">Last week</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trends;
