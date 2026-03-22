import React from 'react';
import { useGameStore, setScreen } from '../store';

export default function BottomNav() {
  const { currentScreen } = useGameStore();
  
  const navs = [
    { id: 'sim', icon: '🎮', label: 'MISSION' },
    { id: 'missions', icon: '📋', label: 'MISSIONS' },
    { id: 'skills', icon: '🌿', label: 'SKILLS' },
    { id: 'cert', icon: '🏆', label: 'CERTS' },
    { id: 'dar', icon: '🤖', label: 'AI DAR' },
    { id: 'teacher', icon: '📊', label: 'TEACHER' },
  ];

  return (
    <div className="bottom-nav flex border-t border-[#ffffff12] bg-[#111318] shrink-0 z-50 pb-[env(safe-area-inset-bottom,0px)]">
      {navs.map(n => (
        <button 
          key={n.id}
          className={`nav-btn flex-1 flex flex-col items-center justify-center gap-[3px] py-2 px-1 font-mono text-[7px] tracking-[1px] cursor-pointer border-none bg-transparent transition-all duration-200 uppercase border-t-2 ${currentScreen === n.id ? 'text-[#FF6B35] border-t-[#D64000]' : 'text-[#6B6860] border-t-transparent hover:text-[#A8A49C]'}`}
          onClick={() => setScreen(n.id)}
        >
          <span className="nav-icon text-[18px]">{n.icon}</span>
          {n.label}
        </button>
      ))}
    </div>
  );
}
