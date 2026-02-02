
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, User as UserIcon, Lock, Mail, Apple, Github } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin({
      id: '123',
      name: name || 'Alex Johnson',
      email: email || 'alex.j@example.com',
      currentWeight: 165,
      targetWeight: 155,
      dailyCalories: 2400,
      proteinGoal: 150,
      activityLevel: 'Moderately Active',
      profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      units: 'Imperial',
      level: 1,
      xp: 0,
      xpNextLevel: 500,
      lastAwardedDate: new Date().toISOString().split('T')[0],
      awardsClaimed: {
        protein: false,
        water: false,
        calories: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 justify-center">
      <div className="mb-12">
        <div className="w-16 h-16 bg-lime-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-lime-500/20">
          <ActivityIcon size={32} color="black" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">FitTrack Pro</h1>
        <p className="text-zinc-500 text-lg">Your elite fitness journey starts here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isRegistering}
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-lime-400 text-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
        >
          {isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
        <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Or continue with</span>
        <div className="flex-1 h-[1px] bg-zinc-800"></div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors">
          <Apple size={20} /> Apple
        </button>
        <button className="flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors">
          <Github size={20} /> Google
        </button>
      </div>

      <p className="mt-12 text-center text-zinc-500 font-medium">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-lime-400 font-bold hover:underline"
        >
          {isRegistering ? 'Sign In' : 'Register Now'}
        </button>
      </p>
    </div>
  );
};

const ActivityIcon = ({size, color}: {size: number, color: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default Auth;
