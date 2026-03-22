import React from 'react';
import { useGameStore, store, setScreen, toast } from '../store';
import { MISSIONS } from '../constants';

export default function MissionsScreen() {
  const state = useGameStore();

  const tNames = ['', 'CADET', 'TECHNICIAN', 'ANALYST', 'SYS ENG'];
  const tierName = tNames[state.tier] || 'CADET';

  return (
    <div id="screen-missions" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full">
      <div className="page-topbar flex items-center justify-between gap-3 py-2.5 px-4 border-b border-[#ffffff12] bg-[#111318] shrink-0">
        <div className="page-title font-display text-[20px] text-[#E8E4DC] tracking-[2px]">MISSIONS</div>
        <span className="pill mars">{tierName} · T{state.tier}</span>
        <span className="pill">{state.activeModifiers.length ? state.activeModifiers.map(m => m.name).join(' • ') : 'No active modifiers'}</span>
      </div>
      
      <div className="missions-body flex-1 overflow-y-auto p-4 pb-24">
        <div className="mission-grid grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
          {MISSIONS.map(m => {
            const locked = (state.guestMode && m.id !== 1) || state.tier < m.unlockTier;
            const done = state.missionsCompleted.includes(m.id);
            
            return (
              <div 
                key={m.id} 
                className={`mission-card bg-[#111318] border border-[#ffffff12] p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group ${locked ? 'opacity-45 cursor-default' : 'hover:border-[rgba(214,64,0,0.3)] hover:-translate-y-[2px]'} ${done ? 'border-[#1A4D35]' : ''}`}
                onClick={() => {
                  if (!locked) {
                    store.setState(s => { s.currentMissionId = m.id; });
                    toast('LOADING: ' + m.name.toUpperCase());
                    setScreen('sim');
                  }
                }}
              >
                {!locked && <div className="absolute inset-0 bg-[#D64000] scale-x-0 origin-left transition-transform duration-200 opacity-5 group-hover:scale-x-100"></div>}
                <div className="mc-num font-display text-[32px] text-[#8B2500] absolute top-2 right-3 leading-none">M0{m.id}</div>
                <div className="mc-name font-ui font-bold text-[14px] text-[#E8E4DC] mb-1.5">{m.name}</div>
                <div className="mc-constraint font-mono text-[9px] text-[#6B6860] mb-2.5 leading-[1.5]">{m.constraint}</div>
                <div className="mc-tags flex gap-1 flex-wrap">
                  <span className={`pill ${locked ? 'red' : done ? 'green' : 'amber'}`}>
                    {locked ? (state.guestMode && m.id !== 1 ? 'UNLOCK FULL DEMO' : 'LOCKED T' + m.unlockTier) : done ? 'COMPLETE' : 'AVAILABLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6">
          <div className="font-mono text-[9px] text-[#6B6860] tracking-[2px] mb-2.5">EXPANSION MODULES — CONSTRAINT LEARNING ENGINE</div>
          <div className="expansion-grid grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5 mt-3">
            <div className="expansion-card bg-[#111318] border border-[#ffffff12] p-4 text-center opacity-60 relative overflow-hidden">
              <div className="absolute top-2 -right-5 bg-[#D64000] text-white font-mono text-[7px] tracking-[2px] py-0.5 px-7 rotate-45 origin-center content-['COMING_SOON']">COMING SOON</div>
              <div className="exp-icon text-[30px] mb-2">🌊</div>
              <div className="exp-name font-ui font-bold text-[13px] text-[#E8E4DC] mb-1">Disaster Response</div>
              <div className="exp-desc text-[10px] text-[#6B6860] leading-[1.5]">Earthquake search & rescue under cascading failure</div>
            </div>
            <div className="expansion-card bg-[#111318] border border-[#ffffff12] p-4 text-center opacity-60 relative overflow-hidden">
              <div className="absolute top-2 -right-5 bg-[#D64000] text-white font-mono text-[7px] tracking-[2px] py-0.5 px-7 rotate-45 origin-center content-['COMING_SOON']">COMING SOON</div>
              <div className="exp-icon text-[30px] mb-2">🌍</div>
              <div className="exp-name font-ui font-bold text-[13px] text-[#E8E4DC] mb-1">Climate Policy</div>
              <div className="exp-desc text-[10px] text-[#6B6860] leading-[1.5]">Carbon neutrality decisions under political constraints</div>
            </div>
            <div className="expansion-card bg-[#111318] border border-[#ffffff12] p-4 text-center opacity-60 relative overflow-hidden">
              <div className="absolute top-2 -right-5 bg-[#D64000] text-white font-mono text-[7px] tracking-[2px] py-0.5 px-7 rotate-45 origin-center content-['COMING_SOON']">COMING SOON</div>
              <div className="exp-icon text-[30px] mb-2">💡</div>
              <div className="exp-name font-ui font-bold text-[13px] text-[#E8E4DC] mb-1">Startup Capital</div>
              <div className="exp-desc text-[10px] text-[#6B6860] leading-[1.5]">Runway management, hiring, and fundraising under burn rate</div>
            </div>
            <div className="expansion-card bg-[#111318] border border-[#ffffff12] p-4 text-center opacity-60 relative overflow-hidden">
              <div className="absolute top-2 -right-5 bg-[#D64000] text-white font-mono text-[7px] tracking-[2px] py-0.5 px-7 rotate-45 origin-center content-['COMING_SOON']">COMING SOON</div>
              <div className="exp-icon text-[30px] mb-2">🦠</div>
              <div className="exp-name font-ui font-bold text-[13px] text-[#E8E4DC] mb-1">Pandemic Response</div>
              <div className="exp-desc text-[10px] text-[#6B6860] leading-[1.5]">Public health trade-offs under exponential spread</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
