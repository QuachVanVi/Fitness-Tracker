
import React, { useState } from 'react';
import { User } from '../types';
import { 
  ArrowLeft, LogOut, ChevronRight, Bell, Scale, 
  Target, Activity, Flame, Shield, Globe, Edit3, Smartphone, Beef, X, Check, Star
} from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

interface EditModalProps {
  label: string;
  field: keyof User;
  value: string | number;
  onSave: (field: keyof User, value: number) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ label, field, value, onSave, onClose }) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSave = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onSave(field, num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-[#121212] border border-zinc-800 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Update {label}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>
        
        <input 
          autoFocus
          type="number"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 px-6 text-white text-3xl font-black text-center focus:outline-none focus:ring-2 focus:ring-lime-500/30 mb-8"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border border-zinc-800 text-zinc-500 font-bold hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition-colors shadow-lg shadow-lime-500/10"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface UnitModalProps {
  currentUnit: 'Imperial' | 'Metric';
  onSave: (unit: 'Imperial' | 'Metric') => void;
  onClose: () => void;
}

const UnitModal: React.FC<UnitModalProps> = ({ currentUnit, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-[#121212] border border-zinc-800 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Measurement Units</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="space-y-4 mb-8">
          <button 
            onClick={() => onSave('Imperial')}
            className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all ${currentUnit === 'Imperial' ? 'border-lime-500 bg-lime-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}
          >
            <div className="text-left">
              <p className="font-bold text-lg">Imperial</p>
              <p className="text-xs text-zinc-500">Pounds (lbs)</p>
            </div>
            {currentUnit === 'Imperial' && <Check size={24} className="text-lime-400" />}
          </button>

          <button 
            onClick={() => onSave('Metric')}
            className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all ${currentUnit === 'Metric' ? 'border-lime-500 bg-lime-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}
          >
            <div className="text-left">
              <p className="font-bold text-lg">Metric</p>
              <p className="text-xs text-zinc-500">Kilograms (kg)</p>
            </div>
            {currentUnit === 'Metric' && <Check size={24} className="text-lime-400" />}
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Profile: React.FC<Props> = ({ user, onLogout, onUpdateUser, onBack }) => {
  const [editingField, setEditingField] = useState<{ field: keyof User, label: string } | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  if (!user) return null;

  const handleUpdateField = (field: keyof User, value: number) => {
    const updated = { ...user, [field]: value };
    onUpdateUser(updated);
  };

  const handleUpdateUnit = (newUnit: 'Imperial' | 'Metric') => {
    if (newUnit === user.units) return;

    let factor = newUnit === 'Metric' ? 0.453592 : 2.20462;
    const updated = { 
      ...user, 
      units: newUnit,
      currentWeight: Math.round(user.currentWeight * factor * 10) / 10,
      targetWeight: Math.round(user.targetWeight * factor * 10) / 10
    };
    onUpdateUser(updated);
    setIsUnitModalOpen(false);
  };

  const weightLabel = user.units === 'Imperial' ? 'lbs' : 'kg';
  const xpPercent = (user.xp / user.xpNextLevel) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-40 border-b border-zinc-900/50">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">Profile & Goals</h1>
        <button onClick={onBack} className="text-lime-400 font-bold hover:text-lime-300 transition-colors">Done</button>
      </header>

      <div className="flex flex-col items-center p-8 mb-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-800 ring-4 ring-lime-500/10">
            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-lime-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg border-2 border-black">
            Lvl {user.level}
          </div>
        </div>
        <h2 className="text-2xl font-black mb-1">{user.name}</h2>
        <p className="text-zinc-500 text-sm font-medium mb-6">{user.email}</p>
        
        {/* XP Summary in Profile */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Rank: Elite Striver</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">{user.xp} / {user.xpNextLevel} XP</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
            <div className="h-full bg-lime-400 transition-all duration-500" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-full border border-lime-500/20 bg-lime-500/5 text-lime-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Shield size={12} fill="currentColor" fillOpacity={0.2} /> Pro Member
        </div>
      </div>

      <div className="px-6 space-y-10 pb-32">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Health Goals</h3>
            <span className="text-[10px] bg-lime-400/10 text-lime-500 px-2 py-0.5 rounded-md font-bold">LIVE SYNC</span>
          </div>
          <div className="space-y-3">
            <GoalItem 
              icon={<Scale size={20} />} 
              label="Current Weight" 
              value={`${user.currentWeight} ${weightLabel}`} 
              onEdit={() => setEditingField({ field: 'currentWeight', label: `Weight (${weightLabel})` })}
            />
            <GoalItem 
              icon={<Target size={20} />} 
              label="Target Weight" 
              value={`${user.targetWeight} ${weightLabel}`} 
              onEdit={() => setEditingField({ field: 'targetWeight', label: `Goal Weight (${weightLabel})` })}
            />
            <GoalItem 
              icon={<Flame size={20} />} 
              label="Daily Calories" 
              value={`${user.dailyCalories} kcal`} 
              onEdit={() => setEditingField({ field: 'dailyCalories', label: 'Daily Budget' })}
            />
            <GoalItem 
              icon={<Beef size={20} />} 
              label="Protein Goal" 
              value={`${user.proteinGoal} g`} 
              onEdit={() => setEditingField({ field: 'proteinGoal', label: 'Protein Target' })}
            />
          </div>
        </section>

        <section>
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Settings</h3>
          <div className="space-y-3">
            <div className="bg-[#121212] p-4 rounded-3xl flex items-center justify-between border border-zinc-900 group hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400"><Bell size={20} /></div>
                <div>
                  <p className="font-bold text-sm">Notifications</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Reminders enabled</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-lime-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            
            <div onClick={() => setIsUnitModalOpen(true)}>
              <PrefItem 
                icon={<Globe size={20} />} 
                label="Measurement Units" 
                subtext={user.units === 'Imperial' ? 'Imperial (lbs, oz)' : 'Metric (kg, ml)'} 
              />
            </div>
            
            <PrefItem icon={<Smartphone size={20} />} label="Apple Health Sync" subtext="Last synced: Just now" />
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full bg-zinc-900/50 border border-zinc-900 text-zinc-500 py-4 rounded-3xl font-bold flex items-center justify-center gap-3 hover:text-red-400 hover:bg-red-950/10 hover:border-red-900/30 transition-all active:scale-[0.98]"
        >
          <LogOut size={18} /> Sign Out Account
        </button>

        <div className="pt-4 flex flex-col items-center gap-2 opacity-30">
          <Activity size={24} className="text-lime-400" />
          <p className="text-[10px] font-black tracking-widest uppercase">FitTrack Pro v2.5.1</p>
        </div>
      </div>

      {editingField && (
        <EditModal 
          label={editingField.label}
          field={editingField.field}
          value={user[editingField.field] as number}
          onSave={handleUpdateField}
          onClose={() => setEditingField(null)}
        />
      )}

      {isUnitModalOpen && (
        <UnitModal 
          currentUnit={user.units}
          onSave={handleUpdateUnit}
          onClose={() => setIsUnitModalOpen(false)}
        />
      )}
    </div>
  );
};

const GoalItem = ({ icon, label, value, onEdit }: { icon: React.ReactNode, label: string, value: string, onEdit: () => void }) => (
  <div 
    onClick={onEdit}
    className="bg-[#121212] p-4 rounded-3xl flex items-center justify-between border border-zinc-900 hover:border-lime-500/30 group transition-all cursor-pointer active:scale-[0.99]"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm text-white group-hover:text-lime-400 transition-colors">{label}</p>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">{value}</p>
      </div>
    </div>
    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-lime-400 group-hover:text-black transition-all">
      <Edit3 size={14} />
    </div>
  </div>
);

const PrefItem = ({ icon, label, subtext }: { icon: React.ReactNode, label: string, subtext: string }) => (
  <div className="bg-[#121212] p-4 rounded-3xl flex items-center justify-between border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">{icon}</div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-[10px] text-zinc-500 font-bold uppercase">{subtext}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-zinc-700" />
  </div>
);

export default Profile;
