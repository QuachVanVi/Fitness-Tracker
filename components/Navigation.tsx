
import React from 'react';
import { AppView } from '../types';
import { Home as HomeIcon, ClipboardList, User as UserIcon, BarChart3, Plus } from 'lucide-react';

interface Props {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<Props> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-black/90 backdrop-blur-2xl border-t border-zinc-900 px-6 flex items-center justify-between z-50 max-w-md mx-auto">
      <NavButton 
        active={currentView === AppView.HOME} 
        onClick={() => setView(AppView.HOME)} 
        icon={<HomeIcon size={22} />}
        label="Home"
      />
      <NavButton 
        active={currentView === AppView.LOG} 
        onClick={() => setView(AppView.LOG)} 
        icon={<ClipboardList size={22} />}
        label="Meals"
      />
      
      {/* Center FAB */}
      <button 
        onClick={() => setView(AppView.LOG)}
        className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all -translate-y-6 border-4 border-black"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      <NavButton 
        active={currentView === AppView.REPORTS} 
        onClick={() => setView(AppView.REPORTS)} 
        icon={<BarChart3 size={22} />}
        label="Reports"
      />
      <NavButton 
        active={currentView === AppView.PROFILE} 
        onClick={() => setView(AppView.PROFILE)} 
        icon={<UserIcon size={22} />}
        label="Profile"
      />
    </nav>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? 'text-green-500' : 'text-zinc-600'}`}
  >
    <div className={`transition-all ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </button>
);

export default Navigation;
